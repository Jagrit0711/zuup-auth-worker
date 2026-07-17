# Security Features

Security is the primary reason the Zuup Auth Gateway exists. This page outlines the specific security mechanisms implemented at the edge to protect our infrastructure.

## Zero Leakage (Secret Substitution)

When the Edge Proxy receives a request from a client application (e.g., `https://auth.zuup.dev/rest/v1/...`), it intercepts the HTTP headers and reads the 100-character **Gateway Secret**. 

If the secret matches our allowed keys, the proxy:
1. Drops the Gateway Secret from the headers.
2. Injects the **true** `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` depending on the route and user validation.
3. Redirects the fetch request to the real database URL.

If an attacker attempts to scrape the Gateway Secret and run arbitrary queries, the Edge Proxy will aggressively block them because it enforces strict Origin validation and rate limiting before forwarding any traffic.

## Bot Protection (Cloudflare Turnstile)

Authentication routes are historically the most abused endpoints on any application. To prevent credential stuffing and brute-force attacks, we enforce **Cloudflare Turnstile** on all our login, signup, and password reset routes. 

The Edge Proxy intercepts the `cf-turnstile-response` token submitted by the frontend form and performs a server-side verification against Cloudflare's API *before* it even touches our database to check user credentials.

## Edge Rate Limiting

We leverage Cloudflare KV to maintain distributed, low-latency rate limit counters based on client IPs and User-Agents. 

If an endpoint is hammered, the edge immediately returns a `429 Too Many Requests` without the core database ever knowing an attack occurred. This prevents our Supabase instance from being overwhelmed by DDoS attacks.

- **Sensitive Routes:** Endpoints like login and password resets are strictly capped at 5 attempts per 15 minutes per IP.
- **Global Proxy Routes:** General database queries routed through the proxy are globally capped at 300 requests per minute per IP.

## Admin Roles & Deep Authorization

We enforce strict deep authorization on privileged endpoints. For example, endpoints that require the `SUPABASE_SERVICE_ROLE_KEY` (such as `/api/admin/users`) are heavily protected. 

The Proxy extracts the JWT from the incoming request, cryptographically verifies it with the database, and asserts that the user possesses the `admin` role via Role-Based Access Control (`app_metadata.role === 'admin'`). 

*(As a fallback, it also verifies if the `user.email` matches the `ADMIN_EMAIL` configured in the edge environment variables to prevent accidental lockouts).*

If neither condition is met, a `403 Forbidden` is returned immediately.

## Proxy Blocklists & Bypasses

To prevent internal Supabase configurations and version details from leaking to the public internet, the Edge Proxy explicitly blocks direct access to routes like:
- `/auth/v1/settings`
- `/auth/v1/health`

**Authorized Bypasses:**
Because our internal applications require access to these settings, the proxy will automatically bypass the blocklist and authorize the request if:
1. The `apikey` header matches the `GATEWAY_SECRET`.
2. Or, a valid JWT session is provided via the `Authorization` header or `__Secure-zuup_session` cookie.
