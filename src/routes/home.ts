import { Context } from 'hono';
import { renderLayout } from '../components/layout';

export const homeHandler = (c: Context) => {
  c.header('Cache-Control', 'public, max-age=3600');
  
  const content = `
    <main class="flex-1 w-full max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] animate-fade-in-up stagger-1">
            The impregnable backend of <br />
            <span class="text-primary squiggly font-caveat font-bold text-6xl md:text-8xl">Zuup.</span>
        </h1>
        <p class="text-lg md:text-xl text-muted max-w-2xl mt-8 mb-12 animate-fade-in-up stagger-2 font-medium">
            From getting hacked twice a week to absolutely never. Zuup Auth is the global edge proxy securing our entire ecosystem.
        </p>

        <div class="flex flex-wrap gap-4 mb-20 animate-fade-in-up stagger-2">
            <a href="/docs" class="px-8 py-3 bg-primary text-white font-caveat text-2xl rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(250,40,95,0.4)]">Integrate Auth &rarr;</a>
            <a href="/api" class="px-8 py-3 bg-transparent border-2 border-dashed border-gray-600 text-white font-caveat text-2xl rounded-xl hover:border-gray-400 transition-colors">Explore Payments</a>
        </div>

        <!-- Interactive Node Diagram Section -->
        <div class="w-full max-w-5xl mx-auto mb-32 animate-fade-in-up stagger-3" id="interactive-diagram">
            
            <!-- Interactive Container -->
            <div class="relative bg-[#050505] border border-white/5 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-12 interactive-box min-h-[500px]">
                
                <!-- Background Grid -->
                <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] rounded-3xl"></div>

                <!-- SVG Lines Container -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" id="diagram-lines">
                    <!-- Lines injected by JS -->
                </svg>

                <!-- Left Node: Client -->
                <div id="node-client" class="z-10 group relative w-full md:w-64 p-6 bg-[#111111] border border-white/10 rounded-2xl cursor-default text-left hover:-translate-y-1 transition-transform">
                    <h3 class="text-xl font-bold text-white mb-2">example.com</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">Needs to fetch database, auth, or payments securely.</p>
                </div>

                <!-- Center Node: Gateway -->
                <div id="node-gateway" class="z-10 group relative w-full md:w-[320px] p-8 bg-[#110508] border border-[#FA285F]/30 rounded-3xl cursor-default text-center shadow-[0_0_80px_rgba(250,40,95,0.15)] hover:shadow-[0_0_100px_rgba(250,40,95,0.25)] transition-shadow">
                    <h3 class="text-3xl font-black text-white mb-2">auth.zuup.dev</h3>
                    <p class="text-[#FA285F] text-xs font-bold uppercase tracking-[0.2em] mb-4">Edge Gateway</p>
                    <p class="text-sm text-gray-300 leading-relaxed">The unified SSO, database proxy, and payment verifier.</p>
                </div>

                <!-- Right Nodes: Backend Services -->
                <div class="flex flex-col gap-6 z-10 w-full md:w-64">
                    <!-- Cloudflare -->
                    <div id="node-cf" class="group relative p-5 bg-[#111111] border border-white/10 rounded-2xl cursor-default text-left hover:translate-x-1 transition-transform">
                        <h3 class="text-lg font-bold text-white mb-1">Cloudflare</h3>
                        <p class="text-xs text-gray-400 leading-relaxed">Runtime environment, caching, and Turnstile bots.</p>
                    </div>
                    
                    <!-- Supabase -->
                    <div id="node-db" class="group relative p-5 bg-[#111111] border border-white/10 rounded-2xl cursor-default text-left hover:translate-x-1 transition-transform">
                        <h3 class="text-lg font-bold text-white mb-1">Supabase</h3>
                        <p class="text-xs text-gray-400 leading-relaxed">Core database access and authentication flow.</p>
                    </div>

                    <!-- Razorpay -->
                    <div id="node-pay" class="group relative p-5 bg-[#111111] border border-white/10 rounded-2xl cursor-default text-left hover:translate-x-1 transition-transform">
                        <h3 class="text-lg font-bold text-white mb-1">Razorpay</h3>
                        <p class="text-xs text-gray-400 leading-relaxed">Standard payment flow and verification.</p>
                    </div>
                </div>

            </div>
            
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const container = document.querySelector('.interactive-box');
                    if (!container) return;
                    
                    const nodes = {
                        client: document.getElementById('node-client'),
                        gateway: document.getElementById('node-gateway'),
                        cf: document.getElementById('node-cf'),
                        db: document.getElementById('node-db'),
                        pay: document.getElementById('node-pay')
                    };

                    const svg = document.getElementById('diagram-lines');

                    const drawLines = () => {
                        if (window.innerWidth < 768) {
                            svg.innerHTML = '';
                            return;
                        }
                        
                        let defs = \`<defs>
                            <linearGradient id="grad-client-gw" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#333333" />
                                <stop offset="100%" stop-color="#FA285F" />
                            </linearGradient>
                            <linearGradient id="grad-gw-cf" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#FA285F" />
                                <stop offset="100%" stop-color="#F38020" />
                            </linearGradient>
                            <linearGradient id="grad-gw-db" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#FA285F" />
                                <stop offset="100%" stop-color="#3ECF8E" />
                            </linearGradient>
                            <linearGradient id="grad-gw-pay" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#FA285F" />
                                <stop offset="100%" stop-color="#0284C7" />
                            </linearGradient>
                        </defs>\`;
                        svg.innerHTML = defs;
                        
                        const drawLine = (n1, n2, gradId) => {
                            const b1 = n1.getBoundingClientRect();
                            const b2 = n2.getBoundingClientRect();
                            const cB = container.getBoundingClientRect();
                            const p1 = { x: b1.right - cB.left, y: b1.top + b1.height/2 - cB.top };
                            const p2 = { x: b2.left - cB.left, y: b2.top + b2.height/2 - cB.top };
                            
                            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            path.setAttribute('d', \`M\${p1.x},\${p1.y} C\${p1.x + 40},\${p1.y} \${p2.x - 40},\${p2.y} \${p2.x},\${p2.y}\`);
                            path.setAttribute('stroke', \`url(#\${gradId})\`);
                            path.setAttribute('stroke-width', '2');
                            path.setAttribute('fill', 'none');
                            path.setAttribute('stroke-dasharray', '4 4');
                            
                            svg.appendChild(path);
                        };
                        
                        setTimeout(() => {
                            drawLine(nodes.client, nodes.gateway, 'grad-client-gw');
                            drawLine(nodes.gateway, nodes.cf, 'grad-gw-cf');
                            drawLine(nodes.gateway, nodes.db, 'grad-gw-db');
                            drawLine(nodes.gateway, nodes.pay, 'grad-gw-pay');
                        }, 50);
                    };
                    
                    window.addEventListener('resize', drawLines);
                    setTimeout(drawLines, 200);
                });
            </script>
        </div>

        <!-- The 3 Awesome Features restored with Cool Design -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fade-in-up stagger-3 mb-24">
            <div class="text-left border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors">
                <h3 class="text-2xl font-bold mb-3 tracking-tight">Identity & SSO</h3>
                <p class="text-muted leading-relaxed text-sm font-medium">A seamless "Sign in with Zuup" experience. We provide a single, highly secure account to access all our internal platforms and builder tools globally.</p>
            </div>
            <div class="text-left border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors">
                <h3 class="text-2xl font-bold mb-3 tracking-tight">Edge Proxy</h3>
                <p class="text-muted leading-relaxed text-sm font-medium">Our intelligent edge gateway intercepts and filters traffic before it reaches our core databases, ensuring maximum security and zero credential leakage.</p>
            </div>
            <div class="text-left border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors">
                <h3 class="text-2xl font-bold mb-3 tracking-tight">Unified Payments</h3>
                <p class="text-muted leading-relaxed text-sm font-medium">A centralized transaction layer that securely processes checkouts and event registrations for massive programs like summer.zuup.dev.</p>
            </div>
        </div>

        <!-- Get it for your site (Fixed CTA) -->
        <div class="w-full max-w-4xl mx-auto p-16 bg-[#0a0a0a] border border-[#222] rounded-[2.5rem] text-center animate-fade-in-up stagger-3 relative overflow-hidden flex flex-col items-center shadow-2xl group hover:border-[#FA285F]/50 transition-colors duration-500">
            <div class="absolute inset-0 bg-gradient-to-b from-[#FA285F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white relative z-10">Get it for your <span class="font-caveat text-primary text-5xl md:text-7xl squiggly">own site.</span></h2>
            <p class="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-2xl leading-relaxed relative z-10">
                Say goodbye to data leaks, failed checkouts, and unreliable auth. Bring Zuup's enterprise-grade edge infrastructure to your project today.
            </p>
            <a href="mailto:jagrit@zuup.dev" class="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform text-lg shadow-[0_0_20px_rgba(250,40,95,0.4)] hover:shadow-[0_0_40px_rgba(250,40,95,0.6)]">
                Contact Sales
            </a>
        </div>
        
    </main>
  `;
  return c.html(renderLayout("Zuup Auth | Secure Gateway", content));
};
