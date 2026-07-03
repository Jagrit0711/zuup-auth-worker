import { Context } from 'hono';
import { renderLayout } from '../components/layout';

export const docsHandler = (c: Context) => {
  c.header('Cache-Control', 'public, max-age=3600');
  const content = `
    <main class="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-16 pb-24 flex flex-col md:flex-row gap-12 text-left">
        
        <!-- Left Sidebar (Supabase Style) -->
        <aside class="w-full md:w-64 shrink-0 border-r border-[#222] pr-6 md:sticky top-32 self-start hidden md:block overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
            <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-green-500 font-bold text-sm">Zuup Auth</span>
                </div>
                <ul class="space-y-3 text-sm font-medium text-gray-400">
                    <li><a href="#overview" class="text-white hover:text-white transition-colors">Overview</a></li>
                    <li><a href="#architecture" class="hover:text-white transition-colors">Architecture</a></li>
                </ul>
            </div>
            
            <div class="mb-8">
                <h4 class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">Getting Started</h4>
                <ul class="space-y-3 text-sm font-medium text-gray-400">
                    <li><a href="#react-nextjs" class="hover:text-white transition-colors">React & Next.js</a></li>
                    <li><a href="#cloudflare-workers" class="hover:text-white transition-colors">Cloudflare Workers</a></li>
                    <li><a href="#nodejs-express" class="hover:text-white transition-colors">Node.js Express</a></li>
                </ul>
            </div>

            <div class="mb-8">
                <h4 class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">Concepts</h4>
                <ul class="space-y-3 text-sm font-medium text-gray-400">
                    <li><a href="#secret-substitution" class="hover:text-white transition-colors">Secret Substitution</a></li>
                    <li><a href="#edge-rate-limiting" class="hover:text-white transition-colors">Edge Rate Limiting</a></li>
                    <li><a href="#unified-payments" class="hover:text-white transition-colors">Unified Payments</a></li>
                    <li><a href="#bot-protection" class="hover:text-white transition-colors">Bot Protection (Turnstile)</a></li>
                </ul>
            </div>
            
            <div class="mb-8">
                <h4 class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">Flows (How-Tos)</h4>
                <ul class="space-y-3 text-sm font-medium text-gray-400">
                    <li><a href="#ssr" class="hover:text-white transition-colors">Server-Side Rendering</a></li>
                    <li><a href="#enterprise-sso" class="hover:text-white transition-colors">Enterprise SSO</a></li>
                    <li><a href="#custom-oauth" class="hover:text-white transition-colors">Custom OAuth Providers</a></li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0 max-w-3xl pb-32">
            <h1 class="text-4xl font-black mb-6 text-white tracking-tight" id="overview">Overview</h1>
            <p class="text-xl text-gray-400 mb-12 leading-relaxed">
                Welcome to the official Zuup Auth documentation. This guide details how our Cloudflare Workers edge proxy intercepts, sanitizes, and secures all database and authentication traffic for the Zuup ecosystem.
            </p>

            <div id="the-dark-ages" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">The Dark Ages</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    Before Zuup Auth, our applications communicated directly with the database. We embedded Anon keys into our frontend clients, relying on Row Level Security (RLS) to keep data safe. Unfortunately, RLS is notoriously difficult to configure perfectly at scale, leading to vulnerabilities. When malicious actors scraped the Anon keys, they were able to query the database directly, bypassing our UI logic entirely and orchestrating attacks.
                </p>
            </div>

            <div id="the-edge-proxy" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">The Edge Proxy</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    To completely eliminate this attack vector, we built the <strong>Edge Proxy</strong>. It is a hyper-fast Cloudflare Worker that sits between every client and our core infrastructure. Now, client applications are never given real database credentials.
                </p>
                <div class="bg-black border border-white/10 rounded-xl p-6 mt-6">
                    <pre class="text-sm text-gray-300 overflow-x-auto"><code>// What your frontend actually runs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://auth.zuup.dev';
const GATEWAY_SECRET = process.env.GATEWAY_SECRET; 

export const supabase = createClient(SUPABASE_URL, GATEWAY_SECRET);</code></pre>
                </div>
            </div>

            <div id="zero-leakage" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">Zero Leakage (Secret Substitution)</h2>
                <p class="text-gray-400 leading-relaxed mb-4" id="secret-substitution">
                    When the Edge Proxy receives a request to <code>https://auth.zuup.dev/rest/v1/...</code>, it reads the 100-character Gateway Secret. If the secret matches our allowed keys, the proxy drops the Gateway Secret from the headers and injects the <strong>true</strong> Supabase Anon Key and redirects the fetch request to the real database URL.
                </p>
                <p class="text-gray-400 leading-relaxed">
                    If an attacker attempts to scrape the Gateway Secret and run arbitrary queries, the Edge Proxy will aggressively block them because it enforces strict Origin validation and rate limiting before forwarding any traffic.
                </p>
            </div>

            <div id="bot-protection" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">Bot Protection</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    Authentication routes are historically the most abused endpoints on any application. We enforce Cloudflare Turnstile on all our login, signup, and password reset routes. The Edge Proxy intercepts the <code>cf-turnstile-response</code> token and performs a server-side verification against Cloudflare's API before ever touching our database to check user credentials.
                </p>
            </div>

            <div id="unified-state" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">Unified State</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    Because we run a vast ecosystem of interconnected apps (builder tools, admin panels, student dashboards), we needed a single source of truth for identity. Zuup Auth issues standardized JWTs stored in secure, HttpOnly Edge Cookies. This creates a seamless "Sign in with Zuup" SSO experience across every domain we operate.
                </p>
            </div>

            <div id="high-performance-caching" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">High-Performance Caching</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    Our proxy utilizes Cloudflare's global CDN to cache public database queries. Heavily requested public tables (like event schedules or public profiles) are cached at the edge, drastically reducing database load and delivering responses in sub-10ms globally.
                </p>
            </div>

            <div id="rate-limiting" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">Rate Limiting</h2>
                <p class="text-gray-400 leading-relaxed mb-4" id="edge-rate-limiting">
                    We leverage Cloudflare KV to maintain distributed, low-latency rate limit counters based on client IPs and User-Agents. If an endpoint is hammered, the edge immediately returns a <code>429 Too Many Requests</code> without the core database ever knowing an attack occurred.
                </p>
            </div>

            <div id="payment-abstraction" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">Payment Abstraction</h2>
                <p class="text-gray-400 leading-relaxed mb-4" id="unified-payments">
                    Handling payments securely on the client is dangerous. Zuup Auth acts as a unified Razorpay gateway. Client apps request a checkout session, the Edge Proxy talks to Razorpay, generates the order, and signs the transaction. Webhooks are verified directly at the edge, ensuring zero tampering with payment states.
                </p>
            </div>

            <div id="the-result" class="mb-16 pt-8 border-t border-white/5">
                <h2 class="text-2xl font-bold mb-4 text-white">The Result</h2>
                <p class="text-gray-400 leading-relaxed mb-4">
                    A completely bulletproof architecture that powers Zuup's massive growth securely. No more leaked secrets, no more bots, and absolute control over our traffic.
                </p>
            </div>
            
            <div id="react-nextjs" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">React & Next.js Integration</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">To integrate the Edge Proxy with Next.js, simply replace your standard Supabase URL in your environment variables with <code>https://auth.zuup.dev</code>. For server-side rendering, ensure that the Gateway Secret is only passed to the client through secure Next.js server actions or API routes.</p>
            </div>
            
            <div id="cloudflare-workers" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">Cloudflare Workers Integration</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">If you are building an internal API on Cloudflare Workers, you can utilize Service Bindings to call Zuup Auth directly, bypassing the public internet and eliminating latency.</p>
            </div>
            
             <div id="nodejs-express" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">Node.js Express Integration</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">For legacy Node.js Express servers, use the standard <code>@supabase/supabase-js</code> client initialized with the proxy URL and Secret.</p>
            </div>
            
            <div id="ssr" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">Server-Side Rendering (Flows)</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">When rendering pages on the server, you must forward the HttpOnly SSO cookie from the incoming request to the Edge Proxy. The Proxy will validate the session JWT and return the authenticated user's data.</p>
            </div>
            
            <div id="enterprise-sso" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">Enterprise SSO (Flows)</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">We support SAML and OIDC for enterprise partners. Redirect users to <code>/sso/login</code> with the target provider ID, and the Edge Proxy will handle the entire OAuth dance.</p>
            </div>
            
            <div id="custom-oauth" class="mb-16 pt-8 border-t border-white/5">
                 <h2 class="text-2xl font-bold mb-4 text-white">Custom OAuth Providers (Flows)</h2>
                 <p class="text-gray-400 leading-relaxed mb-4">Custom providers like GitHub, Google, and Discord are fully supported. The callback URL must always be set to <code>https://auth.zuup.dev/auth/v1/callback</code>.</p>
            </div>
        </div>

        <!-- Right Sidebar (On this page) -->
        <aside class="w-full md:w-56 shrink-0 md:sticky top-32 self-start hidden lg:block overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
            <h4 class="text-[13px] font-bold text-white mb-4">On this page</h4>
            <ul class="space-y-3 text-sm font-medium text-gray-400 border-l border-white/10">
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#the-dark-ages" class="hover:text-white transition-colors">The Dark Ages</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#the-edge-proxy" class="hover:text-white transition-colors">The Edge Proxy</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#zero-leakage" class="hover:text-white transition-colors">Zero Leakage</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#bot-protection" class="hover:text-white transition-colors">Bot Protection</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#unified-state" class="hover:text-white transition-colors">Unified State</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#high-performance-caching" class="hover:text-white transition-colors">High-Performance Caching</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#rate-limiting" class="hover:text-white transition-colors">Rate Limiting</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#payment-abstraction" class="hover:text-white transition-colors">Payment Abstraction</a></li>
                <li class="pl-4 border-l border-transparent hover:border-primary transition-colors"><a href="#the-result" class="hover:text-white transition-colors">The Result</a></li>
            </ul>
        </aside>

    </main>
    
    <script>
        // Simple scroll spy logic
        document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('main h2');
            const navLinks = document.querySelectorAll('aside:last-child a');
            
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.parentElement.offsetTop;
                    if (scrollY >= sectionTop - 100) {
                        current = section.parentElement.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('text-primary');
                    link.parentElement.classList.remove('border-primary');
                    link.parentElement.classList.add('border-transparent');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('text-primary');
                        link.parentElement.classList.remove('border-transparent');
                        link.parentElement.classList.add('border-primary');
                    }
                });
            });
        });
    </script>
  `;
  return c.html(renderLayout("Zuup Auth | Documentation", content));
};
