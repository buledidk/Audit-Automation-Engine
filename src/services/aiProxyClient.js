/**
 * AI Proxy Client
 * Browser-safe drop-in replacement for the Anthropic SDK's `messages.create()` shape.
 *
 * Why this exists: Sprint 1 S1-00 (CC-01 dependency, Finding A in REFINEMENT_ROADMAP_v2).
 * The Anthropic SDK's browser-allow-flag ships the API key in the client bundle.
 * This client routes all requests through the server-side `/api/ai` proxy instead.
 *
 * Usage (drop-in replacement):
 *   // before — direct browser-side SDK with the unsafe flag
 *   // after — proxy:
 *   import { AiProxyClient } from "../services/aiProxyClient.js";
 *   this.client = new AiProxyClient();
 *
 *   // call sites unchanged
 *   await this.client.messages.create({ model, messages, max_tokens, ... });
 */

const DEFAULT_BASE_URL = "/api/ai";

export class AiProxyClient {
  constructor({ baseUrl } = {}) {
    this.baseUrl = baseUrl || DEFAULT_BASE_URL;
    this.messages = new Messages(this);
  }
}

class Messages {
  constructor(parent) {
    this.parent = parent;
    this.batches = new Batches(parent);
  }

  async create(params) {
    const res = await fetch(`${this.parent.baseUrl}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      let detail;
      try {
        detail = await res.json();
      } catch {
        detail = { error: res.statusText };
      }
      const err = new Error(`AI proxy error ${res.status}: ${detail.error || detail.message || "unknown"}`);
      err.status = res.status;
      err.detail = detail;
      throw err;
    }
    return res.json();
  }
}

// Batches: stub surface in phase 1 — claudeClient.js batch path migration is phase 2.
// These methods throw a clear, traceable error so any accidental call surfaces immediately.
class Batches {
  async create() {
    throw new Error(
      "AiProxyClient.messages.batches.create is not yet implemented. " +
        "Tracked in S1-00 phase 2 (claudeClient.js migration). " +
        "Until then, batch processing requires a server-side caller."
    );
  }
  async retrieve() {
    throw new Error("AiProxyClient.messages.batches.retrieve is not yet implemented (S1-00 phase 2).");
  }
  async results() {
    throw new Error("AiProxyClient.messages.batches.results is not yet implemented (S1-00 phase 2).");
  }
}

export default AiProxyClient;
