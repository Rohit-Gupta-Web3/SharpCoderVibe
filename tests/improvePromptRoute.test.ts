import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const improvePromptMock = vi.fn();
vi.mock("../lib/chatService", () => ({
  ChatService: vi.fn(() => ({ improvePrompt: improvePromptMock })),
}));

import { POST } from "../app/api/improve-prompt/route";

let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  improvePromptMock.mockReset();
  process.env.GEMINI_API_KEY = "test-key";
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
});

describe("improve-prompt API route", () => {
  it("returns improved prompt", async () => {
    improvePromptMock.mockResolvedValueOnce("better");
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: "test" }),
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ result: "better" });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("validates prompt type", async () => {
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: 123 }),
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Prompt must be a string" });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("handles service errors", async () => {
    improvePromptMock.mockRejectedValueOnce(new Error("boom"));
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: "test" }),
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "boom" });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("handles timeout aborts", async () => {
    const err = new Error("aborted");
    (err as any).name = "AbortError";
    improvePromptMock.mockRejectedValueOnce(err);
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: "test" }),
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Request timed out" });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: "{ invalid",
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body" });
     expect(errorSpy).toHaveBeenCalled();
  });

  it("returns error when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: "test" }),
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Gemini API key is missing" });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("accepts API key from header when env var is absent", async () => {
    delete process.env.GEMINI_API_KEY;
    improvePromptMock.mockResolvedValueOnce("header-better");
    const req = new NextRequest(
      new Request("http://test", {
        method: "POST",
        body: JSON.stringify({ prompt: "test" }),
        headers: { "x-api-key": "header-key" },
      }),
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ result: "header-better" });
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
