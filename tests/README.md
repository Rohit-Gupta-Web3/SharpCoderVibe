# Tests

This directory contains unit tests for the Next.js Gemini integration.

- `chatService.test.ts` validates the prompt improvement logic, including:
  - returning a placeholder for empty prompts
  - sending system and user messages to the Gemini API
  - handling network failures gracefully
  - surfacing structured and plain-text API error responses
  - propagating abort errors for timed-out requests
- `improvePromptRoute.test.ts` exercises the API route with:
  - successful prompt enhancement
  - validation of non-string prompts
  - simulated service failures
  - timeout abort handling
  - invalid JSON bodies
  - missing API key and header-based key usage
  - API key provided in the request body
  - model selection via `GEMINI_MODEL`
- `colorPaletteSelector.test.tsx` verifies the color palette selector, ensuring:
  - application-friendly Color Hunt palettes are exposed
  - selecting a palette emits the expected prompt snippet
- `dashboard.test.tsx` confirms the dashboard:
  - displays the "Create an Application" preset
  - routes to the Figma import screen when the import button is clicked
