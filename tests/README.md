# Tests

This directory contains unit tests for the Next.js Gemini integration.

- `chatService.test.ts` validates the prompt improvement logic, including:
  - returning a placeholder for empty prompts
  - sending system and user messages to the Gemini API
  - handling network failures gracefully
  - propagating abort errors for timed-out requests
- `improvePromptRoute.test.ts` exercises the API route with:
  - successful prompt enhancement
  - validation of non-string prompts
  - simulated service failures
  - timeout abort handling
