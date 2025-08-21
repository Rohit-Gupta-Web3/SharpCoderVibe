# Tests

This directory contains unit tests for the Next.js Azure OpenAI integration.

- `chatService.test.ts` validates the prompt improvement logic, including:
  - returning a placeholder for empty prompts
  - sending system and user messages to the Azure OpenAI client
  - handling network failures gracefully
  - propagating abort errors for timed-out requests
