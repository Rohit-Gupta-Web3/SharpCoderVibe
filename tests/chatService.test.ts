import { describe, it, expect } from "vitest";
import {
  ChatService,
  PLACEHOLDER_RESPONSE,
  SYSTEM_PROMPT,
  type GeminiConfig
} from "../lib/chatService";

describe("ChatService", () => {
  const config: GeminiConfig = {
    apiKey: "key",
    model: "gemini-pro"
  };

  it("returns placeholder when prompt is empty", async () => {
    const svc = new ChatService(config, (() => Promise.reject(new Error("should not call"))) as any);
    const result = await svc.improvePrompt("  ");
    expect(result).toBe(PLACEHOLDER_RESPONSE);
  });

  it("sends system and user messages and returns response", async () => {
    const fetchMock = (url: string, options: any) => {
      expect(url).toBe(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=key"
      );
      const body = JSON.parse(options.body);
      expect(body).toEqual({
        contents: [{ role: "user", parts: [{ text: "test" }] }],
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] }
      });
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [{ content: { parts: [{ text: "improved" }] } }]
          })
      });
    };
    const svc = new ChatService(config, fetchMock as any);
    const result = await svc.improvePrompt("test");
    expect(result).toBe("improved");
  });

  it("throws error when API fails", async () => {
    const fetchMock = () => Promise.reject(new Error("network"));
    const svc = new ChatService(config, fetchMock as any);
    await expect(svc.improvePrompt("test")).rejects.toThrow("network");

  });

  it("propagates abort errors", async () => {
    const fetchMock = (_url: string, opts: any) =>
      new Promise((_resolve, reject) => {
        opts.signal.addEventListener("abort", () => {
          const err = new Error("aborted");
          (err as any).name = "AbortError";
          reject(err);
        });
      });
    const svc = new ChatService(config, fetchMock as any);
    const controller = new AbortController();
    const promise = svc.improvePrompt("test", controller.signal);
    controller.abort();
    await expect(promise).rejects.toHaveProperty("name", "AbortError");
  });
});

