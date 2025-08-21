export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export const PLACEHOLDER_RESPONSE = "/* Enter a prompt to improve */";

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
  private readonly fetchFn: typeof fetch;

  constructor(config: GeminiConfig, fetchFn: typeof fetch = fetch) {
    if (!config?.apiKey) throw new Error("Gemini API key is missing.");
    this.apiKey = config.apiKey;
    this.model = config.model ?? "gemini-pro";
    this.fetchFn = fetchFn;
  }

  async improvePrompt(rawPrompt: string, signal?: AbortSignal): Promise<string> {
    if (!rawPrompt || !rawPrompt.trim()) {
      return PLACEHOLDER_RESPONSE;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: rawPrompt }]}],
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] }
    };

    try {
      const res = await this.fetchFn(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw err;
      }
      throw new Error("Failed to improve prompt");
    }
  }
}

export default ChatService;

