# Zuup Auth Infrastructure (OAuth 2.1 Provider)

This is the central, highly-secure authentication worker for all of Zuup's services (`auth.zuup.dev`). 

It acts as a gateway to Supabase, entirely hiding the database schema and preventing direct database communication from the frontend for sensitive authentication operations. It serves a custom Neo-Brutalist HTML UI natively, featuring a 6-digit OTP code, Password Reset flow, and dynamic routing.

## 🚀 How to Deploy to Cloudflare

Because this worker uses Hono, it's incredibly lightweight and deploys instantly to Cloudflare Workers.

### 1. Deploy the Code
Run the following command inside this folder:
```bash
npx wrangler deploy
```

### 2. Set Production Secrets (CRITICAL)
Your production worker needs the Supabase URL and the **Service Role Key** (NOT the anon key). Since this is running securely on the server side, it is safe to use the Service Role Key here to bypass RLS for auth operations.

Run these two commands in your terminal and paste your values when prompted:
```bash
npx wrangler secret put SUPABASE_URL
```
```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## 💻 Local Development

To run this locally alongside your main Zuup site:
1. Ensure your `.dev.vars` file is present in this folder with your Supabase keys.
2. Run `npm run dev`.
3. The auth worker will be available at `http://localhost:8787/login`.

## 🔄 Pushing to a separate GitHub Repo

To keep this completely decoupled from the `zuup-main` frontend repository:

```bash
# Inside zuup-auth-worker folder:
git init
git add .
git commit -m "Initial commit of Auth Worker"
git branch -M main
git remote add origin https://github.com/Jagrit0711/zuup-auth-worker.git
git push -u origin main
```
*(Make sure you create the `zuup-auth-worker` repository on GitHub first!)*
# zuup-auth-worker
