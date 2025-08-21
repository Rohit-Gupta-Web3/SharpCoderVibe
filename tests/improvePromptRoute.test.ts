import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const improvePromptMock = vi.fn();
vi.mock("../lib/chatService", () => ({
  ChatService: vi.fn(() => ({ improvePrompt: improvePromptMock })),
}));

import { POST } from "../app/api/improve-prompt/route";

beforeEach(() => {
  improvePromptMock.mockReset();
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
  });
});
