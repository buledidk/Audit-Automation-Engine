/**
 * Model Selection Service
 * Manages multi-model AI strategy: Claude → OpenAI → Ollama
 * with health checking, fallback logic, and performance monitoring
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import axios from "axios";

class ModelSelectionService {
  constructor() {
    this.modelStatus = {
      claude: { available: false, latency: 0, lastCheck: 0 },
      openai: { available: false, latency: 0, lastCheck: 0 },
      ollama: { available: false, latency: 0, lastCheck: 0 },
    };

    this.clients = {
      claude: new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      }),
      openai: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      ollama: axios.create({
        baseURL: process.env.OLLAMA_URL || "http://localhost:11434",
        timeout: 5000,
      }),
    };

    this.modelConfig = {
      claude: {
        model: "claude-sonnet-4-6",
        maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 4096,
        temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.2,
      },
      openai: {
        model: "gpt-4-turbo",
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 8000,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
      },
      ollama: {
        model: process.env.OLLAMA_MODEL || "llama3",
        maxTokens: parseInt(process.env.OLLAMA_MAX_TOKENS) || 2048,
        temperature: parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.5,
      },
    };

    this.executionHistory = [];
    this.initializeHealthCheck();
  }

  /**
   * Initialize periodic health checks for all models
   */
  initializeHealthCheck() {
    this.healthCheckInterval = setInterval(() => {
      this.healthCheckAllModels();
    }, 60000); // Check every minute
  }

  /**
   * Health check all models
   */
  async healthCheckAllModels() {
    console.log("🏥 Running health checks on all AI models...");

    await Promise.all([
      this.healthCheckClaude(),
      this.healthCheckOpenAI(),
      this.healthCheckOllama(),
    ]);

    console.log("✅ Health check complete", this.modelStatus);
  }

  /**
   * Health check Claude
   */
  async healthCheckClaude() {
    const start = Date.now();
    try {
      await this.clients.claude.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 100,
        messages: [{ role: "user", content: "ping" }],
      });
      this.modelStatus.claude = {
        available: true,
        latency: Date.now() - start,
        lastCheck: Date.now(),
      };
    } catch (error) {
      console.warn("⚠️  Claude health check failed:", error.message);
      this.modelStatus.claude = {
        available: false,
        latency: 0,
        lastCheck: Date.now(),
        error: error.message,
      };
    }
  }

  /**
   * Health check OpenAI
   */
  async healthCheckOpenAI() {
    const start = Date.now();
    try {
      await this.clients.openai.models.retrieve("gpt-4-turbo");
      this.modelStatus.openai = {
        available: true,
        latency: Date.now() - start,
        lastCheck: Date.now(),
      };
    } catch (error) {
      console.warn("⚠️  OpenAI health check failed:", error.message);
      this.modelStatus.openai = {
        available: false,
        latency: 0,
        lastCheck: Date.now(),
        error: error.message,
      };
    }
  }

  /**
   * Health check Ollama
   */
  async healthCheckOllama() {
    const start = Date.now();
    try {
      await this.clients.ollama.get("/api/tags");
      this.modelStatus.ollama = {
        available: true,
        latency: Date.now() - start,
        lastCheck: Date.now(),
      };
    } catch (error) {
      console.warn("⚠️  Ollama health check failed:", error.message);
      this.modelStatus.ollama = {
        available: false,
        latency: 0,
        lastCheck: Date.now(),
        error: error.message,
      };
    }
  }

  /**
   * Select best model based on agent preference and availability
   */
  selectModel(agentName, preferredModel = "primary") {
    const priority =
      preferredModel === "primary"
        ? ["claude", "openai", "ollama"]
        : preferredModel === "secondary"
          ? ["openai", "claude", "ollama"]
          : ["ollama", "openai", "claude"];

    // Find first available model in priority order
    for (const modelName of priority) {
      if (this.modelStatus[modelName].available || this.isModelRecentlyHealthy(modelName)) {
        console.log(
          `✅ Selected model for ${agentName}: ${modelName}`
        );
        return {
          name: modelName,
          client: this.clients[modelName],
          config: this.modelConfig[modelName],
          status: this.modelStatus[modelName],
        };
      }
    }

    // Fallback to first model with lowest latency
    console.warn(
      `⚠️  No healthy models found, using lowest latency: ${modelName}`
    );
    return {
      name: "ollama", // Fallback to always-available local model
      client: this.clients.ollama,
      config: this.modelConfig.ollama,
      status: this.modelStatus.ollama,
    };
  }

  /**
   * Check if model was healthy in last 5 minutes
   */
  isModelRecentlyHealthy(modelName) {
    const status = this.modelStatus[modelName];
    const timeSinceCheck = Date.now() - status.lastCheck;
    return status.available || timeSinceCheck < 300000; // 5 minutes
  }

  /**
   * Execute task with Claude
   */
  async executeClaude(messages, config = {}) {
    const mergedConfig = { ...this.modelConfig.claude, ...config };

    try {
      const response = await this.clients.claude.messages.create({
        model: mergedConfig.model,
        max_tokens: mergedConfig.maxTokens,
        temperature: mergedConfig.temperature,
        messages: messages,
      });

      this.recordExecution("claude", true, response);
      return response;
    } catch (error) {
      console.error("❌ Claude execution failed:", error);
      this.recordExecution("claude", false, error);
      throw error;
    }
  }

  /**
   * Execute task with OpenAI
   */
  async executeOpenAI(messages, config = {}) {
    const mergedConfig = { ...this.modelConfig.openai, ...config };

    try {
      const response = await this.clients.openai.chat.completions.create({
        model: mergedConfig.model,
        max_tokens: mergedConfig.maxTokens,
        temperature: mergedConfig.temperature,
        messages: messages,
      });

      this.recordExecution("openai", true, response);
      return response;
    } catch (error) {
      console.error("❌ OpenAI execution failed:", error);
      this.recordExecution("openai", false, error);
      throw error;
    }
  }

  /**
   * Execute task with Ollama
   */
  async executeOllama(messages, config = {}) {
    const mergedConfig = { ...this.modelConfig.ollama, ...config };

    try {
      // Format messages for Ollama
      const prompt = messages.map((m) => m.content).join("\n");

      const response = await this.clients.ollama.post("/api/generate", {
        model: mergedConfig.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: mergedConfig.temperature,
          num_predict: mergedConfig.maxTokens,
        },
      });

      this.recordExecution("ollama", true, response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Ollama execution failed:", error);
      this.recordExecution("ollama", false, error);
      throw error;
    }
  }

  /**
   * Execute with automatic fallback
   */
  async executeWithFallback(messages, modelPreference = "primary") {
    const models = ["claude", "openai", "ollama"];
    let lastError;

    for (const modelName of models) {
      try {
        const selected = this.selectModel("fallback", modelPreference);

        if (selected.name === "claude") {
          return await this.executeClaude(messages, selected.config);
        } else if (selected.name === "openai") {
          return await this.executeOpenAI(messages, selected.config);
        } else if (selected.name === "ollama") {
          return await this.executeOllama(messages, selected.config);
        }
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️  ${modelName} failed, trying next model...`,
          error.message
        );
      }
    }

    throw new Error(
      `All models failed. Last error: ${lastError?.message}`
    );
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return {
      claude: this.modelStatus.claude,
      openai: this.modelStatus.openai,
      ollama: this.modelStatus.ollama,
      recommended: this.selectModel("general").name,
    };
  }

  /**
   * Record execution for metrics
   */
  recordExecution(modelName, success, result) {
    this.executionHistory.push({
      modelName,
      success,
      timestamp: Date.now(),
      tokensUsed:
        result?.usage?.total_tokens ||
        result?.eval_count ||
        0,
    });

    // Keep history to last 1000 executions
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-1000);
    }
  }

  /**
   * Get execution metrics
   */
  getMetrics() {
    const total = this.executionHistory.length;
    const successful = this.executionHistory.filter((e) => e.success).length;
    const byModel = {};

    this.executionHistory.forEach((entry) => {
      if (!byModel[entry.modelName]) {
        byModel[entry.modelName] = {
          total: 0,
          successful: 0,
          totalTokens: 0,
        };
      }
      byModel[entry.modelName].total++;
      if (entry.success) byModel[entry.modelName].successful++;
      byModel[entry.modelName].totalTokens += entry.tokensUsed;
    });

    return {
      totalExecutions: total,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      byModel,
      history: this.executionHistory.slice(-100), // Last 100
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

export default new ModelSelectionService();
