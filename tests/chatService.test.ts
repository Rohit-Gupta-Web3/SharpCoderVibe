import { describe, it, expect } from "vitest";
import { ChatService, PLACEHOLDER_RESPONSE, SYSTEM_PROMPT, type AzureOpenAIConfig } from "../lib/chatService";

class MockClient {
  constructor(private readonly responder: (messages: any[]) => any | Promise<any>) {}
  getChatCompletions(_deployment: string, messages: any[]) {
    return Promise.resolve(this.responder(messages));
  }
}

describe("ChatService", () => {
  const config: AzureOpenAIConfig = {
    endpoint: "https://example.com",
    deployment: "gpt",
    apiKey: "key"
  };

  it("returns placeholder when prompt is empty", async () => {
    const svc = new ChatService(config, new MockClient(() => ({ choices: [] })) as any);
    const result = await svc.improvePrompt("  ");
    expect(result).toBe(PLACEHOLDER_RESPONSE);
  });

  it("sends system and user messages and returns response", async () => {
    const svc = new ChatService(config, new MockClient((messages) => {
      expect(messages).toEqual([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "test" }
      ]);
      return { choices: [{ message: { content: "improved" } }] };
    }) as any);
    const result = await svc.improvePrompt("test");
    expect(result).toBe("improved");
  });

  it("throws error when API fails", async () => {
    const svc = new ChatService(config, new (class {
      getChatCompletions() {
        throw new Error("network");
      }
    })() as any);
    await expect(svc.improvePrompt("test")).rejects.toThrow("Failed to improve prompt");
  });

  it("propagates abort errors", async () => {
    const svc = new ChatService(config, new (class {
      getChatCompletions(_d: string, _m: any[], opts: any) {
        return new Promise((_resolve, reject) => {
          opts.abortSignal.addEventListener("abort", () => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
      }
    })() as any);
    const controller = new AbortController();
    const promise = svc.improvePrompt("test", controller.signal);
    controller.abort();
    await expect(promise).rejects.toHaveProperty("name", "AbortError");
  });
});
