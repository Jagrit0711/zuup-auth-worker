# Integration Guide

Integrating your applications with the Zuup Auth Gateway is designed to be as seamless as possible.

## Database Proxy Setup

Instead of exposing your Supabase credentials in your frontend application, set your environment variables to point to your Zuup Auth instance:

```env
# Frontend .env
VITE_SUPABASE_URL=https://auth.zuup.dev
VITE_SUPABASE_ANON_KEY=your_custom_gateway_secret
```

Initialize your Supabase client normally. All requests will now be routed through the edge worker, keeping your actual database keys completely hidden.

> [!WARNING]
> **Security Note regarding JWTs and RLS:** 
> Zuup Auth verifies user sessions at the edge and securely passes the valid user JWT to Supabase. While hiding your Anon key prevents basic abuse, **it does not replace Row Level Security (RLS)**. You must ensure your Supabase database has strict RLS policies enabled to govern exactly what data users can read or write.

## Platform Specific Integration

### React & Next.js

To integrate the Edge Proxy with Next.js, simply replace your standard Supabase URL in your environment variables with `https://auth.zuup.dev`. 

For Server-Side Rendering (SSR), ensure that the Gateway Secret is only passed to the client through secure Next.js server actions or API routes.

### Cloudflare Workers

If you are building an internal API on Cloudflare Workers, you can utilize **Service Bindings** to call Zuup Auth directly. This bypasses the public internet entirely, eliminating HTTP overhead and latency.

### Node.js Express

For legacy Node.js Express servers, use the standard `@supabase/supabase-js` client initialized with the proxy URL and the Gateway Secret.

## Server-Side Rendering (SSR) Flows

When rendering pages on the server (e.g. Next.js `getServerSideProps` or Remix Loaders), you must forward the `HttpOnly` SSO cookie from the incoming request to the Edge Proxy. 

The Proxy will validate the session JWT via the cookie and return the authenticated user's data seamlessly without requiring the client to pass Bearer tokens manually.
