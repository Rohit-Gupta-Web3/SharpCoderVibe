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
- `authService.test.ts` covers the authentication service layer, verifying:
  - end-to-end signup with authenticator setup and login toggles the session flag
  - duplicate signups are rejected
  - invalid login attempts are rejected
  - requests respect `AbortController` cancellations
- `authFlow.test.tsx` exercises the login and signup forms ensuring:
  - login proceeds through password and authenticator steps before navigation
  - signup requires authenticator setup before redirecting to the dashboard
  - authentication errors surface to the user
- `rootRedirect.test.tsx` ensures the landing page redirects based on session state:
  - missing or expired sessions route to login
  - valid sessions show the dashboard
- `db.test.ts` verifies the database layer persists and retrieves users when a file-based store is configured.
- `firebase.test.ts` checks Firebase initialization, covering env credentials, file-path credentials, invalid JSON, and default initialization when credentials are absent.
