# README - Task 5: Production-Ready Authentication

## Completed Changes
We transitioned the authentication modules from an insecure sandbox mode to a cryptographically validated, production-ready implementation:

### 1. Client Login Drawer Cleanup
- **File**: [LoginDrawer.jsx](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/client/src/components/LoginDrawer.jsx)
- Removed the **Google Sandbox Bypass** button and its associated `handleGoogleMockLogin` controller.
- Removed all hardcoded instructions prompting users to use mock bypass codes (e.g. `123456`) under the OTP input field and placeholders.

### 2. Backend OTP Security
- **File**: [app.js (OTP Route)](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L182-L191)
- Removed hardcoded test verification overrides for `123456` and `111111`.
- Now, verification exclusively checks the local in-memory OTP store loaded from live dispatch flows (e.g. SMS via Twilio or Email).

### 3. Backend Google OAuth Security
- **File**: [app.js (Google Route)](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L476-L510)
- Removed the insecure JWT base64 decode fallback logic.
- Implemented cryptographic signature verification using the official `google-auth-library` `OAuth2Client.verifyIdToken()` API.
- Rejects any requests with malformed, unverified, or signature-less credentials.

### 4. Backend Firebase ID Token Security
- **File**: [app.js (Firebase Helper & Route)](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L233-L315)
- Implemented manual dynamic signature verification utilizing cached public certificates:
  - Dynamically fetches Google's public certificates from Google's secure token endpoint.
  - Caches certificates with proper `Cache-Control` header respect (handling key expiry and max-age parameters).
  - Decodes and extracts the token header key identifier (`kid`), retrieves the correct public key certificate, and executes signature validation via `jsonwebtoken` `RS256` validation rules.
  - Verifies token issuer claim is matching `https://securetoken.google.com/<projectId>`.

## Security Impact (SDE4 Standard)
- Arbitrary account spoofing is blocked: the backend will never accept unverified, signature-less, or manually decoded tokens.
- OTP bypasses are blocked: logins are restricted to verified OTP codes generated in memory and dispatched to the buyer.
