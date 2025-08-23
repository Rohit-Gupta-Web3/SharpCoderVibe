import { NextRequest, NextResponse } from "next/server";
import { ChatService, PLACEHOLDER_RESPONSE } from "../../../lib/chatService";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON body", err);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { prompt, apiKey: bodyKey } = body || {};

    if (typeof prompt !== "string") {
      console.error("Prompt must be a string", { prompt });
      return NextResponse.json({ error: "Prompt must be a string" }, { status: 400 });
    }

    const headerKey =
      req.headers.get("x-api-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const apiKey = process.env.OPENAI_API_KEY || headerKey || bodyKey;
    // If there's no API key available, return a safe placeholder result so
    // the client receives a response it can display in the textarea. This
    // keeps the UX working locally without requiring the external Gemini
    // key during development. The real implementation still requires a key.
    if (typeof apiKey !== "string" || !apiKey) {
      console.warn("Gemini API key is missing; returning placeholder response for development.");
      return NextResponse.json({ result: PLACEHOLDER_RESPONSE });
    }

    const config = {
      apiKey,
      model: process.env.OPENAI_MODEL || "gpt-5-nano",
    };

    const service = new ChatService(config);
    const controller = new AbortController();
    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 60000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await service.improvePrompt(prompt, controller.signal);
      // If the service returned nothing (empty string), return a safe placeholder
      // so the client receives a useful value to display in the textarea.
      if (!result || !result.trim()) {
        return NextResponse.json({ result: PLACEHOLDER_RESPONSE });
      }
      return NextResponse.json({ result });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err: any) {
    console.error("Error handling /api/improve-prompt", err);
    const message = err?.name === "AbortError" ? "Request timed out" : err?.message || "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

