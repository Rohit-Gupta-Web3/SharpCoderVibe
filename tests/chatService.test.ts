import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

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
    expect(logSpy).toHaveBeenCalledWith("Gemini API response", {
      candidates: [{ content: { parts: [{ text: "improved" }] } }],
    });
  });

  it("throws error when API fails", async () => {
    const fetchMock = () => Promise.reject(new Error("network"));
    const svc = new ChatService(config, fetchMock as any);
    await expect(svc.improvePrompt("test")).rejects.toThrow("network");
    expect(errorSpy).toHaveBeenCalled();
  });

  it("includes structured error details", async () => {
    const fetchMock = () =>
      Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify({ error: { message: "bad" } }))
      });
    const svc = new ChatService(config, fetchMock as any);
    await expect(svc.improvePrompt("test")).rejects.toThrow(
      "Request failed with status 400: bad"
    );
    expect(errorSpy).toHaveBeenCalled();
  });

  it("falls back to text error responses", async () => {
    const fetchMock = () =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve("server exploded")
      });
    const svc = new ChatService(config, fetchMock as any);
    await expect(svc.improvePrompt("test")).rejects.toThrow(
      "Request failed with status 500: server exploded"
    );
    expect(errorSpy).toHaveBeenCalled();
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
    expect(errorSpy).toHaveBeenCalled();
  });
});

