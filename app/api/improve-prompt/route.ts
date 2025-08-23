import { NextRequest, NextResponse } from "next/server";
import { ChatService, SYSTEM_PROMPT } from "../../../lib/chatService";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON body", err);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { prompt, apiKey: bodyKey, systemPrompt: bodySystemPrompt } = body || {};

    if (typeof prompt !== "string") {
      console.error("Prompt must be a string", { prompt });
      return NextResponse.json({ error: "Prompt must be a string" }, { status: 400 });
    }

    const headerKey =
      req.headers.get("x-api-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const apiKey = process.env.OPENAI_API_KEY || headerKey || bodyKey;
    if (typeof apiKey !== "string" || !apiKey) {
      console.error("OpenAI API key is missing");
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 });
    }

    const systemPrompt =
      typeof bodySystemPrompt === "string" && bodySystemPrompt.trim()
        ? bodySystemPrompt
        : SYSTEM_PROMPT;

    const config = {
      apiKey,
      model: process.env.OPENAI_MODEL || "gpt-5-nano",
    };

    const service = new ChatService(config);
    const controller = new AbortController();
    const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS) || 60000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await service.improvePrompt(prompt, {
        systemPrompt,
        signal: controller.signal,
      });
      const trimmed = typeof result === "string" ? result.trim() : "";
      if (!trimmed) {
        return NextResponse.json(
          { error: "No enhanced prompt returned" },
          { status: 500 },
        );
      }
      return NextResponse.json({ result: trimmed });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err: any) {
    console.error("Error handling /api/improve-prompt", err);
    const message = err?.name === "AbortError" ? "Request timed out" : err?.message || "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

