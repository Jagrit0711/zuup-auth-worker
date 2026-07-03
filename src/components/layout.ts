export const renderLayout = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        background: '#000000',
                        foreground: '#ffffff',
                        card: '#111111',
                        border: '#222222',
                        input: '#1A1A1A',
                        primary: '#FA285F',
                        primaryHover: '#E01F52',
                        muted: '#888888',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        caveat: ['Caveat', 'cursive'],
                    },
                    animation: {
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #000000; color: #ffffff; font-family: 'Inter', sans-serif; antialiased; }
        .stagger-1 { animation-delay: 100ms; }
        .stagger-2 { animation-delay: 200ms; }
        .stagger-3 { animation-delay: 300ms; }
        [x-cloak] { display: none !important; }
        
        .squiggly {
            position: relative;
            display: inline-block;
        }
        .squiggly::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 12px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10' fill='none' stroke='%23FA285F' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E");
            background-repeat: repeat-x;
            background-size: 40px 100%;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white">

    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-[600px] flex justify-center px-4">
      <nav id="main-nav" class="pointer-events-auto flex items-center gap-1 p-2 rounded-full transition-all duration-300 border bg-black/40 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden max-w-full relative">
        <div class="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-0" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E');"></div>
        <div class="flex items-center w-full z-10 relative overflow-x-auto scrollbar-hide">
        
        <a href="/" class="flex items-center pl-4 pr-2 group shrink-0">
          <img src="https://zuup.dev/zuupw.png" alt="Zuup Logo" class="h-8 w-auto scale-[1.3] origin-left transition-transform duration-300 group-hover:scale-[1.4] group-hover:rotate-6">
        </a>

        <div class="flex items-center gap-1 pl-2 border-l border-white/10 ml-2">
          <a href="/" class="nav-link px-4 py-2 rounded-full text-sm font-bold transition-all text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap">Home</a>
          <a href="/docs" class="nav-link px-4 py-2 rounded-full text-sm font-bold transition-all text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap">Docs</a>
          <a href="/api" class="nav-link px-4 py-2 rounded-full text-sm font-bold transition-all text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap">API</a>
          <a href="/security" class="nav-link px-4 py-2 rounded-full text-sm font-bold transition-all text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap">Security</a>
        </div>

        <div class="flex items-center gap-2 pl-2 ml-2 border-l border-white/10 shrink-0">
          <div class="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full mr-1">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></div>
            <span class="text-xs font-bold tracking-wide text-green-400 uppercase">Active</span>
          </div>
          <a href="https://join.zuup.dev" target="_blank" class="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(250,40,95,0.3)] hover:shadow-[0_0_30px_rgba(250,40,95,0.5)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
            Join
          </a>
        </div>
        
        </div>
      </nav>
    </div>
    
    <div class="h-24"></div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
                if (link.getAttribute('href') === path) {
                    link.classList.remove('text-gray-400', 'hover:bg-white/5');
                    link.classList.add('bg-primary/20', 'text-white');
                }
            });

            const nav = document.getElementById('main-nav');
            if (nav) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 20) {
                        nav.classList.remove('bg-black/40', 'backdrop-blur-md', 'border-white/10');
                        nav.classList.add('bg-black/60', 'backdrop-blur-xl', 'border-white/20', 'shadow-2xl', 'shadow-black/50');
                    } else {
                        nav.classList.remove('bg-black/60', 'backdrop-blur-xl', 'border-white/20', 'shadow-2xl', 'shadow-black/50');
                        nav.classList.add('bg-black/40', 'backdrop-blur-md', 'border-white/10');
                    }
                });
            }
        });
    </script>

    ${bodyContent}

    <!-- Footer -->
    <footer class="mt-auto border-t border-white/10 bg-black py-16 relative overflow-hidden">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div class="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <!-- Logo & About -->
            <div class="col-span-1 md:col-span-1">
                <a href="/" class="flex items-center gap-3 mb-6">
                    <img src="https://zuup.dev/zuupw.png" alt="Zuup Logo" class="h-10 w-auto">
                    <span class="text-2xl font-black tracking-tight text-white">Zuup<span class="text-primary">Auth</span></span>
                </a>
                <p class="text-gray-400 text-sm leading-relaxed font-medium mb-6">
                    Enterprise-grade edge proxy and unified SSO protecting the entire Zuup ecosystem globally. Built for speed, security, and scale.
                </p>
                <div class="flex gap-4">
                    <!-- Instagram -->
                    <a href="https://instagram.com/zuupdev" target="_blank" class="text-gray-400 hover:text-[#FA285F] transition-colors">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <!-- Mail -->
                    <a href="mailto:jagrit@zuup.dev" class="text-gray-400 hover:text-white transition-colors">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </a>
                    <!-- YouTube -->
                    <a href="https://youtube.com/@zuupdev" target="_blank" class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <!-- Substack -->
                    <a href="https://zuup.substack.com" target="_blank" class="text-gray-400 hover:text-[#FF6719] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11L22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
                    </a>
                </div>
            </div>

            <!-- Links Column 1: Zuup -->
            <div class="col-span-1">
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Zuup</h4>
                <ul class="space-y-4">
                    <li><a href="https://zuup.dev/story" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Our Story</a></li>
                    <li><a href="https://zuup.dev/schools" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Schools</a></li>
                    <li><a href="https://zuup.dev/dashboard" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Dashboard</a></li>
                    <li><a href="/privacy" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a></li>
                    <li><a href="/terms" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Terms of Service</a></li>
                </ul>
            </div>

            <!-- Links Column 2: Auth Infrastructure -->
            <div class="col-span-1">
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Auth Infrastructure</h4>
                <ul class="space-y-4">
                    <li><a href="/docs" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Developer Docs</a></li>
                    <li><a href="/api" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Identity Proxy Login</a></li>
                    <li><a href="/api" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Unified Payments API</a></li>
                    <li><a href="/security" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Security Policy</a></li>
                </ul>
            </div>

            <!-- Links Column 3: Ecosystem -->
            <div class="col-span-1">
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Ecosystem</h4>
                <ul class="space-y-4">
                    <li><a href="https://zuup.dev/empower" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Empower</a></li>
                    <li><a href="https://zuup.dev/events" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Events</a></li>
                    <li><a href="https://zuup.dev/saas" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">SaaS</a></li>
                    <li><a href="https://zuup.dev/theming" class="text-gray-400 hover:text-white transition-colors text-sm font-medium">Theming Centre</a></li>
                    <li><a href="https://zuup.dev/surprise" class="text-primary hover:text-primaryHover transition-colors text-sm font-bold flex items-center gap-2">Surprise Me! <span class="text-lg">🎲</span></a></li>
                </ul>
            </div>

        </div>
        
        <div class="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
            <p>&copy; ${new Date().getFullYear()} Zuup. Built with ♥️ for the community.</p>
            <p>Protected by Cloudflare Turnstile & Edge Workers</p>
        </div>
    </footer>
</body>
</html>
`;
