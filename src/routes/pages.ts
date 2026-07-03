import { Context } from 'hono';
import { renderLayout } from '../components/layout';

export const apiHandler = (c: Context) => {
  c.header('Cache-Control', 'public, max-age=3600');
  const content = `
    <main class="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-24 text-left">
        <h1 class="text-4xl md:text-5xl font-black tracking-tighter mb-8">Unified Gateway <span class="font-caveat text-primary text-6xl">API</span></h1>
        
        <div class="prose prose-invert max-w-none">
            <p class="text-lg text-gray-400 mb-12">The official API reference for the Zuup Auth Edge Gateway. This covers both Database Proxy setup and Unified Payments.</p>
            
            <hr class="border-[#222] my-12" />

            <h2 class="text-3xl font-bold mb-6 text-white">Database Proxy Setup</h2>
            <p class="text-gray-400 mb-4">Never expose your Supabase Anon key. Instead, point your client to our Edge Gateway and provide the gateway secret.</p>
            
            <div class="bg-[#111] border border-[#222] p-6 rounded-xl font-mono text-sm text-gray-300 mb-8 overflow-x-auto">
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://auth.zuup.dev';
const GATEWAY_SECRET = process.env.GATEWAY_SECRET;

export const supabase = createClient(SUPABASE_URL, GATEWAY_SECRET);
            </div>
            
            <h3 class="text-xl font-bold mb-4 text-white">How it works</h3>
            <ul class="list-disc pl-6 text-gray-400 space-y-2 mb-12">
                <li>Your client sends requests to <code class="bg-[#222] px-1 rounded">auth.zuup.dev</code></li>
                <li>Cloudflare Workers intercepts the request and verifies the <code>GATEWAY_SECRET</code></li>
                <li>The proxy substitutes the secret with the true Supabase Anon key</li>
                <li>The request is forwarded to Supabase securely</li>
            </ul>

            <hr class="border-[#222] my-12" />

            <h2 class="text-3xl font-bold mb-6 text-white">Unified Payments API</h2>
            <p class="text-gray-400 mb-4">Integrate with our centralized payment gateway to generate checkouts.</p>

            <h3 class="text-xl font-bold mb-4 mt-8 text-white">1. Create a Checkout Session</h3>
            <div class="bg-[#111] border border-[#222] p-6 rounded-xl font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
POST https://auth.zuup.dev/api/payments/checkout
Headers: 
  apikey: {GATEWAY_SECRET}
  
Body:
{
  "amount": 500, // in INR
  "currency": "INR",
  "receipt": "order_rcptid_11",
  "notes": { "event": "summer_camp" }
}
            </div>

            <h3 class="text-xl font-bold mb-4 mt-8 text-white">2. Verify Webhooks</h3>
            <p class="text-gray-400 mb-4">Webhooks from Razorpay are automatically verified by the edge proxy. The verified payload is then synced directly to the Supabase <code>transactions</code> table.</p>
        </div>
    </main>
  `;
  return c.html(renderLayout("Zuup Auth | API Reference", content));
};

export const securityHandler = (c: Context) => {
  c.header('Cache-Control', 'public, max-age=3600');
  const content = `
    <main class="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-24 text-left">
        <h1 class="text-4xl md:text-5xl font-black tracking-tighter mb-8">Security & <span class="font-caveat text-primary text-6xl">Privacy</span></h1>
        <div class="prose prose-invert max-w-none text-gray-400 space-y-6">
            <p class="text-lg text-white">At Zuup, security and privacy are our primary focus. We run entirely on edge infrastructure to guarantee zero-trust validation.</p>
            
            <h3 class="text-xl font-bold text-white mt-8">Data Processing & Privacy</h3>
            <p>auth.zuup.dev acts as a reverse proxy. We do not store, log, or sell your database payloads or personal data. We only collect data necessary for providing authentication and proxy services. We inject the required Row Level Security (RLS) headers and forward the packet in under 5ms.</p>
            
            <h3 class="text-xl font-bold text-white mt-8">Vulnerability Reporting</h3>
            <p>If you believe you have found a security vulnerability in Zuup Auth, please report it immediately to jagrit@zuup.dev. We take all reports seriously and will investigate promptly.</p>
        </div>
    </main>
  `;
  return c.html(renderLayout("Security & Privacy | Zuup Auth", content));
};

export const privacyHandler = securityHandler;

export const termsHandler = (c: Context) => {
  c.header('Cache-Control', 'public, max-age=3600');
  const content = `
    <main class="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-24 text-left">
        <h1 class="text-4xl md:text-5xl font-black tracking-tighter mb-8">Terms of <span class="font-caveat text-primary text-6xl">Service</span></h1>
        <div class="prose prose-invert max-w-none text-gray-400 space-y-6">
            <p>By using Zuup Auth, you agree to these terms.</p>
            <h3 class="text-xl font-bold text-white mt-8">Acceptable Use</h3>
            <p>You may not use Zuup Auth for any illegal activities or to bypass security measures on our partner sites.</p>
        </div>
    </main>
  `;
  return c.html(renderLayout("Terms of Service | Zuup", content));
};
