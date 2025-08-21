import { OpenAIClient, AzureKeyCredential, ChatRequestMessage } from "@azure/openai";

export interface AzureOpenAIConfig {
  endpoint: string;
  deployment: string;
  apiKey: string;
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
  private readonly client: OpenAIClient;
  private readonly deployment: string;

  constructor(config: AzureOpenAIConfig, client?: OpenAIClient) {
    if (!config?.endpoint) throw new Error("Azure OpenAI endpoint is missing.");
    if (!config.deployment) throw new Error("Azure OpenAI deployment is missing.");
    if (!config.apiKey) throw new Error("Azure OpenAI API key is missing.");
    this.deployment = config.deployment;
    this.client = client ?? new OpenAIClient(config.endpoint, new AzureKeyCredential(config.apiKey));
  }

  async improvePrompt(rawPrompt: string, signal?: AbortSignal): Promise<string> {
    if (!rawPrompt || !rawPrompt.trim()) {
      return PLACEHOLDER_RESPONSE;
    }

    const messages: ChatRequestMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: rawPrompt }
    ];

    try {
      const completion = await this.client.getChatCompletions(this.deployment, messages, {
        abortSignal: signal
      });
      return completion.choices?.[0]?.message?.content ?? "";
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw err;
      }
      throw new Error("Failed to improve prompt");
    }
  }
}

export default ChatService;
