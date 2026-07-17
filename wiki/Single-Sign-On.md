# Single Sign-On (SSO)

Zuup Auth functions as a unified OAuth 2.0 Identity Provider for all internal projects and external partners.

## "Sign in with Zuup" OAuth 2.0 Flow

To implement "Sign in with Zuup" on your frontend application, follow these three steps:

1. **Redirect the user to the login portal:**
   Construct a URL that points to the Zuup Auth gateway, passing your application's client ID and callback URL.
   ```text
   https://auth.zuup.dev/login?client_id=YOUR_APP&redirect_uri=https://example.com/callback
   ```

2. **Receive the Authorization Code:**
   After successful authentication (via password or magic link), the user will be redirected back to your application with a temporary authorization code appended to the URL:
   ```text
   https://example.com/callback?code=zcode_123...
   ```

3. **Exchange the Code for Tokens:**
   Have your backend server exchange this temporary code for the user's permanent JWT and profile data by making a `POST` request to the Token API:
   ```http
   POST https://auth.zuup.dev/api/oauth/token
   ```

## Custom OAuth Providers

Custom OAuth providers like **GitHub**, **Google**, and **Discord** are fully supported by the gateway. 

When configuring these applications in their respective developer portals, the Callback URL must always be set to:
```text
https://auth.zuup.dev/auth/v1/callback
```
The Edge Proxy will handle the OAuth dance and unify the session into the standard Zuup Auth format.

## Enterprise SSO

We support SAML and OIDC for enterprise partners. Redirect users to `/sso/login` with the target provider ID, and the Edge Proxy will automatically negotiate the enterprise authentication flow and return a standardized Zuup Session token to your application.
