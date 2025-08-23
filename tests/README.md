# Tests

This directory contains unit tests for the Next.js OpenAI integration.

- `chatService.test.ts` validates the prompt improvement logic, including:
  - rejecting empty prompts
  - sending system and user messages to the OpenAI or Gemini APIs
  - overriding the system prompt when provided
  - handling network failures gracefully
  - surfacing structured and plain-text API error responses
  - propagating abort errors for timed-out requests
  - using `max_completion_tokens` for OpenAI models
  - parsing array-based message content from modern OpenAI responses
- `improvePromptRoute.test.ts` exercises the API route with:
  - successful prompt enhancement and signal forwarding
  - validation of non-string prompts
  - simulated service failures
  - timeout abort handling
  - invalid JSON bodies
  - missing API key and header/body-based key usage
  - model selection via `OPENAI_MODEL`
  - forwarding custom system prompts to the service
  - handling empty service responses
- `colorPaletteSelector.test.tsx` verifies the color palette selector, ensuring:
  - application-friendly Color Hunt palettes are exposed
  - selecting a palette emits the expected prompt snippet
- `dashboard.test.tsx` confirms the dashboard:
  - displays the "Create an Application" preset
  - routes to the Figma import screen when the import button is clicked
  - sends textarea content for prompt enhancement and replaces it with the ChatGPT response
  - surfaces a toast error when enhancement fails
- `authFlow.test.tsx` exercises the login and signup forms ensuring:
  - successful login followed by OTP verification navigates to the dashboard
  - signup collects a full name and redirects to authenticator setup
  - authentication errors surface to the user
- `rootRedirect.test.tsx` ensures the landing page redirects based on session state:
  - missing credentials route to signup
  - stored email without a token routes to login
  - expired sessions redirect to login
  - valid sessions show the dashboard
