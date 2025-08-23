export interface GeminiConfig {
  apiKey: string;
  model?: string;
  // optional explicit provider: 'gemini' | 'openai'
  provider?: "gemini" | "openai";
}

export const SYSTEM_PROMPT =
  "You are a senior prompt engineer applying Gödel’s Scaffolded Cognitive Prompting (GSCP). " +
  "Rewrite the user's prompt using the full 8-step scaffold: " +
  "1) Clarify the user’s intent and core objective. " +
  "2) Extract and define context, including domain knowledge, assumptions, and dependencies. " +
  "3) Identify explicit inputs and hidden variables that affect execution. " +
  "4) Apply constraints (technical, logical, ethical, regulatory) to bound the solution space. " +
  "5) Define expected outputs in clear, verifiable formats. " +
  "6) Establish success criteria and evaluation measures for correctness. " +
  "7) Anticipate edge cases, risks, and ambiguities, proposing coverage strategies. " +
  "8) Perform internal validation to ensure coherence, consistency, and no contradictions. " +
  "Return ONLY the improved, scaffolded final prompt, not the reasoning steps.";

export class ChatService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly provider: "gemini" | "openai";
  private readonly fetchFn: typeof fetch;

  constructor(config: GeminiConfig, fetchFn: typeof fetch = fetch) {
    if (!config?.apiKey) throw new Error("API key is missing.");
    this.apiKey = config.apiKey;
    // provider detection: explicit, or model name, or presence of GEMINI_API_KEY env
    const explicit = config.provider;
    const modelLower = (config.model || "").toLowerCase();
    const detected = explicit ?? (modelLower.includes("gemini") || Boolean(process.env.GEMINI_API_KEY) ? "gemini" : "openai");
    this.provider = detected as any;
    // set sensible defaults per provider
    if (this.provider === "gemini") {
      this.model = config.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    } else {
      this.model = config.model ?? process.env.OPENAI_MODEL ?? "gpt-5-nano";
    }
    this.fetchFn = fetchFn;
  }

  async improvePrompt(
    rawPrompt: string,
    options: { systemPrompt?: string; signal?: AbortSignal } = {}
  ): Promise<string> {
    if (!rawPrompt || !rawPrompt.trim()) {
      throw new Error("Prompt must not be empty");
    }
    const { systemPrompt = SYSTEM_PROMPT, signal } = options;
    // Support two providers: Gemini (Google) and OpenAI
    try {
      let res: any;
      let data: any;

      if (this.provider === "gemini") {
        // Gemini REST generateContent
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const body = {
          system_instruction: { parts: [{ text: systemPrompt }] },
          // single user content block
          contents: [{ role: "user", parts: [{ text: rawPrompt }] }],
        };
        console.debug("ChatService.improvePrompt ->", { url, body: { model: this.model } });
        res = await this.fetchFn(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal,
        });

        if (!res.ok) {
          let message = `Request failed with status ${res.status}`;
          const text = await res.text().catch(() => "");
          if (text) {
            try {
              const json = JSON.parse(text);
              const detail = json?.error?.message ?? json?.error ?? json;
              if (detail) message += `: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`;
            } catch {
              message += `: ${text}`;
            }
          }
          console.error("Gemini API error", message);
          throw new Error(message);
        }

        data = await res.json();
        console.log("Gemini API response", data);
      } else {
        // OpenAI Chat Completions
        const url = `https://api.openai.com/v1/chat/completions`;
        const body = {
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: rawPrompt },
          ],
          // "max_tokens" is unsupported on some newer models; use "max_completion_tokens" instead
          // which caps only the completion portion of the response.
          max_completion_tokens: 800,
        } as const;
        console.debug("ChatService.improvePrompt ->", { url, body: { model: this.model } });
        res = await this.fetchFn(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
          body: JSON.stringify(body),
          signal,
        });

        if (!res.ok) {
          let message = `Request failed with status ${res.status}`;
          const text = await res.text().catch(() => "");
          if (text) {
            try {
              const json = JSON.parse(text);
              const detail = json?.error?.message ?? json?.error ?? json;
              if (detail) message += `: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`;
            } catch {
              message += `: ${text}`;
            }
          }
          console.error("OpenAI API error", message);
          throw new Error(message);
        }

        data = await res.json();
        console.log("OpenAI API response", data);
      }

      // Robust extraction for both providers
      const extractors: Array<() => any> = [
        () => data?.choices?.[0]?.message?.content,
        () => data?.choices?.[0]?.text,
        () => data?.result,
        () => data?.output?.content?.parts?.[0]?.text,
        () => data?.candidates?.[0]?.content?.parts?.[0]?.text,
        () => (typeof data === "string" ? data : undefined),
      ];

      let extracted: any = undefined;
      for (const fn of extractors) {
        try {
          const v = fn();
          if (typeof v === "string" && v.trim() !== "") {
            extracted = v;
            break;
          }
        } catch {
          // ignore and try next
        }
      }

      const finalText = (typeof extracted === "string" ? extracted : "");
      console.debug("ChatService.improvePrompt extracted ->", finalText);

      // Normalize to plain text for the client
      function stripCodeFences(s: string) {
        s = s.replace(/```[\s\S]*?```/g, (m) => m.replace(/(^```\w*|```$)/g, ""));
        s = s.replace(/`([^`]*)`/g, "$1");
        return s;
      }

      function stripMarkdown(s: string) {
        s = s.replace(/^#{1,6}\s*/gm, "");
        s = s.replace(/\*\*(.*?)\*\*/g, "$1");
        s = s.replace(/\*(.*?)\*/g, "$1");
        s = s.replace(/_(.*?)_/g, "$1");
        s = s.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
        return s;
      }

      function tryParseJsonAndExtract(s: string): string | null {
        const trimmed = s.trim();
        if (!trimmed) return null;
        if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return null;
        try {
          const parsed = JSON.parse(trimmed);
          function findStringLeaf(x: any): string | null {
            if (x == null) return null;
            if (typeof x === "string" && x.trim() !== "") return x.trim();
            if (Array.isArray(x)) {
              for (const v of x) {
                const found = findStringLeaf(v);
                if (found) return found;
              }
            } else if (typeof x === "object") {
              for (const k of Object.keys(x)) {
                const found = findStringLeaf(x[k]);
                if (found) return found;
              }
            }
            return null;
          }
          return findStringLeaf(parsed);
        } catch {
          return null;
        }
      }

      let cleaned = finalText;
      const fromJson = tryParseJsonAndExtract(cleaned);
      if (fromJson) {
        cleaned = fromJson;
      } else {
        cleaned = stripCodeFences(cleaned);
        cleaned = stripMarkdown(cleaned);
      }

      cleaned = cleaned.replace(/\r\n/g, "\n").trim();
      console.debug("ChatService.improvePrompt cleaned ->", cleaned);
      return cleaned;
    } catch (err: any) {
      console.error("ChatService.improvePrompt failed", err);
      if (err?.name === "AbortError") {
        throw err;
      }
      throw new Error(err?.message ?? "Failed to improve prompt");
    }
  }
}

export default ChatService;