/**
 * AI Proxy Route
 * Server-side proxy for all Anthropic API calls. Holds the API key in `ANTHROPIC_API_KEY`
 * (server env only, never `VITE_*`). Browser code calls this via `aiProxyClient.js`.
 *
 * Mounted at `/api/ai` in `server/app.js` behind `authenticateToken` and `auditLog`.
 *
 * Endpoints:
 *   POST /api/ai/messages   — proxy `anthropic.messages.create()`
 *
 * Phase 2 will add:
 *   POST /api/ai/batches    — proxy `anthropic.messages.batches.create()`
 *   GET  /api/ai/batches/:id — retrieve
 *   GET  /api/ai/batches/:id/results — stream results
 */

import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();

let anthropicClient = null;
function getAnthropicClient() {
  if (anthropicClient) return anthropicClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI proxy is not configured. Set ANTHROPIC_API_KEY (server-side env, no VITE_ prefix) " +
        "in Vercel project settings or .env.local."
    );
  }
  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

router.post("/messages", async (req, res) => {
  try {
    const { model, messages, max_tokens, system, temperature, thinking, tools, ...rest } = req.body || {};

    if (!model || !messages || !max_tokens) {
      return res.status(400).json({
        error: "Missing required fields. `model`, `messages`, and `max_tokens` are required.",
      });
    }

    const client = getAnthropicClient();
    const params = { model, messages, max_tokens, ...rest };
    if (system !== undefined) params.system = system;
    if (temperature !== undefined) params.temperature = temperature;
    if (thinking !== undefined) params.thinking = thinking;
    if (tools !== undefined) params.tools = tools;

    const response = await client.messages.create(params);
    res.json(response);
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "AI proxy failure";
    if (process.env.NODE_ENV !== "test") {
      console.error("[AI Proxy /messages]", status, message);
    }
    res.status(status).json({ error: message });
  }
});

router.post("/batches", (_req, res) => {
  res.status(501).json({
    error: "Batch endpoint not yet implemented. Tracked in S1-00 phase 2 (claudeClient.js migration).",
  });
});

export default router;
