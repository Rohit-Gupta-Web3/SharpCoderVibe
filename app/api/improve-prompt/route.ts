import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "../../../lib/chatService";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON body", err);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { prompt } = body || {};
    if (typeof prompt !== "string") {
      console.error("Prompt must be a string", { prompt });
      return NextResponse.json({ error: "Prompt must be a string" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    const config = {
      apiKey,
      model: process.env.GEMINI_MODEL || "gemini-pro",
    };

    const service = new ChatService(config);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const result = await service.improvePrompt(prompt, controller.signal);
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

