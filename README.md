# Zuup Auth Gateway & SSO Provider 🚀

Zuup Auth is a high-performance, edge-first authentication proxy built on Cloudflare Workers and Hono. It acts as a blazing-fast centralized login gateway for all your services, acting as a direct proxy to your Supabase backend while providing enterprise-grade security features out of the box.

Additionally, Zuup Auth functions as a full **OAuth 2.0 Identity Provider (IdP)**. It allows third-party websites or your own microservices to easily implement "Sign in with Zuup" functionality!

## 🌟 Features
- **Supabase Reverse Proxy:** Intercepts frontend requests to Supabase and seamlessly injects your hidden Supabase anon/service-role keys securely at the edge.
- **"Sign In With Zuup" SSO:** Fully functional OAuth 2.0 flow for third-party developer integrations.
- **Enterprise Bot Protection:** Seamless Cloudflare Turnstile integration directly in the Alpine.js forms.
- **Global Rate Limiting:** Backed by Cloudflare KV, restricting malicious IP addresses from brute-forcing logins.
- **Session Fingerprinting:** Binds user sessions to their IP and User-Agent to prevent session hijacking.
- **Edge JWT Verification:** Instant edge verification using `jose` before requests hit Supabase.

---

## 🛠️ How to use "Sign In With Zuup" (SSO Integration)

If you have a separate website (e.g., `https://my-awesome-app.com`) and you want users to log in using their Zuup credentials, you can easily integrate Zuup Auth as your SSO Provider.

### Step 1: Generate an API Key
First, you (the platform admin) need to generate a Client ID and Secret for the new application. Run this `curl` command against your Zuup Auth instance (making sure to pass your active login session cookie to authorize the request):

```bash
curl -X POST https://auth.zuup.dev/api/developer/keys \
  -H "Content-Type: application/json" \
  -H "Cookie: __Secure-zuup_session=YOUR_LOGIN_TOKEN" \
  -d '{
    "app_name": "My Awesome App",
    "allowed_origins": ["https://my-awesome-app.com"]
  }'
```

**Response:**
```json
{
  "client_id": "zuup_a1b2c3d4...",
  "client_secret": "zsec_x9y8z7...",
  "allowed_origins": ["https://my-awesome-app.com"]
}
```

Keep the `client_id` and `client_secret` safe!

### Step 2: The Login Redirect
On your application (`my-awesome-app.com`), create a "Sign In with Zuup" button. When the user clicks it, redirect them to the Zuup Auth login page, passing your `client_id` and a `redirect_uri` where they should be sent after a successful login.

```html
<a href="https://auth.zuup.dev/login?client_id=zuup_a1b2c3d4...&redirect_uri=https://my-awesome-app.com/callback">
  Sign in with Zuup
</a>
```

### Step 3: Receive the Authorization Code
The user will see the beautiful Zuup Auth login UI. Once they successfully enter their credentials (or OTP) and pass the Turnstile security check, Zuup Auth will instantly redirect them back to your application with a short-lived `code`:

```text
https://my-awesome-app.com/callback?code=zcode_123456789...
```

### Step 4: Exchange the Code for User Data
Now, your application's **Backend** must securely exchange this `code` for the user's actual session token and profile data. 

*(Warning: Never expose your `client_secret` to the browser. This step MUST happen on your server!)*

```javascript
// Example Node.js Backend Code
const response = await fetch('https://auth.zuup.dev/api/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'zuup_a1b2c3d4...',
    client_secret: 'zsec_x9y8z7...',
    code: req.query.code // The code from the URL
  })
});

const data = await response.json();

console.log(data.access_token); // The user's Supabase JWT!
console.log(data.user);         // The user's profile metadata!
```

**You are now fully authenticated!** You can use `data.access_token` to make direct requests to Supabase on behalf of the user, or drop a cookie to log them into your application.

---

## 🛡️ Hiding your Supabase Anon Key (Reverse Proxy)

You no longer need to expose your real `SUPABASE_URL` or `SUPABASE_ANON_KEY` to the internet! Zuup Auth has a built-in reverse proxy that perfectly mimics the Supabase API, while secretly injecting your actual keys on the backend before the request reaches Supabase.

In your frontend application's `.env` file, simply replace your Supabase credentials with your Zuup Auth domain and a dummy key:

```env
VITE_SUPABASE_URL=https://auth.zuup.dev
VITE_SUPABASE_ANON_KEY=dummy_anon_key
```

Then initialize the standard `supabase-js` client exactly as you normally would:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This sends requests to https://auth.zuup.dev
// Zuup Auth intercepts the request, replaces 'dummy_anon_key' with the real anon key, 
// and securely proxies the request to your actual Supabase project!
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

No more leaked anon keys!

---

## 🔒 Environment Setup

To run Zuup Auth, ensure you have the following secrets in your `.dev.vars` file (and securely uploaded to Cloudflare via `wrangler secret put`):

```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_JWT_SECRET={"keys":[{"kty":"EC","crv":"P-256",...}]}
TURNSTILE_SECRET_KEY=0x4AAAAAA...
```

You must also have your KV databases bound in `wrangler.jsonc`:
- `RATE_LIMITER`
- `ZUUP_OAUTH`

## 🚀 Running Locally
```bash
npm install
npm run dev
```

## 🌐 Deployment
```bash
npx wrangler deploy
```
