import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chatService";

const config = {
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyDfKNJx0wL0IPIw-ONOO4AahEqUBLcmAcw",
  model: process.env.GEMINI_MODEL || "gemini-pro"
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { prompt } = await req.json();
    if (typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt must be a string" }, { status: 400 });
    }
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
    const message = err?.name === "AbortError" ? "Request timed out" : err?.message || "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
