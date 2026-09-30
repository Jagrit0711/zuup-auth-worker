export function renderSuperAdminDashboard(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zuup Console | dash.auth.zuup.dev</title>
    <script>
        // Suppress harmless tailwind play CDN dev warning in browser console
        const _origWarn = console.warn;
        console.warn = function(...args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return;
            _origWarn.apply(console, args);
        };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        bg: '#121318',
                        card: '#181922',
                        cardHover: '#1F202B',
                        input: '#222330',
                        border: '#2B2D3D',
                        borderLight: '#383B4F',
                        primary: '#F04F67',
                        primaryHover: '#D63D5C',
                        secondary: '#3B82F6',
                        success: '#10B981',
                        warning: '#F59E0B',
                        text: '#FFFFFF',
                        muted: '#8F91A3'
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #121318; color: white; }
        [x-cloak] { display: none !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #121318; }
        ::-webkit-scrollbar-thumb { background: #2B2D3D; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #8F91A3; }
        .glass-card { background: rgba(24, 25, 34, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(43, 45, 61, 0.8); }
    </style>
</head>
<body class="min-h-screen flex bg-bg text-white overflow-hidden" x-data="superAdminApp">

    <!-- AUTHENTICATION CHECK / LOGIN OVERLAY -->
    <div x-show="!authenticated" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-md p-4">
        <div class="w-full max-w-md glass-card rounded-2xl p-8 border border-border shadow-2xl">
            <div class="flex items-center gap-3 mb-6">
                <img src="https://zuup.dev/lovable-uploads/b44b8051-6117-4b37-999d-014c4c33dd13.png" alt="Zuup" class="h-9 w-auto">
                <div>
                    <h1 class="text-xl font-bold text-white tracking-tight">Zuup <span class="text-primary font-normal">Console</span></h1>
                    <p class="text-xs text-muted">dash.auth.zuup.dev</p>
                </div>
            </div>
            
            <div class="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-red-300">
                Admin credentials required. Only authorized administrators can access this portal.
            </div>

            <div x-show="authError" x-text="authError" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs"></div>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-muted mb-1">Admin Email</label>
                    <input type="email" x-model="loginEmail" required placeholder="jagrit@zuup.dev" class="w-full px-3.5 py-2.5 bg-input border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors">
                </div>
                <div>
                    <label class="block text-xs font-medium text-muted mb-1">Password</label>
                    <input type="password" x-model="loginPassword" required placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-input border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors">
                </div>
                <button type="submit" :disabled="loginLoading" class="w-full py-3 bg-primary hover:bg-primaryHover text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
                    <span x-show="loginLoading" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    <span x-text="loginLoading ? 'Authenticating...' : 'Sign In to Console'"></span>
                </button>
            </form>
        </div>
    </div>

    <!-- MAIN ADMIN INTERFACE -->
    <div x-show="authenticated" class="flex w-full h-screen overflow-hidden">
        
        <!-- SIDEBAR -->
        <aside class="w-64 bg-card border-r border-border flex flex-col h-screen flex-shrink-0 select-none">
            <!-- Brand -->
            <div class="p-5 border-b border-border flex items-center gap-3">
                <img src="https://zuup.dev/lovable-uploads/b44b8051-6117-4b37-999d-014c4c33dd13.png" alt="Zuup" class="h-8 w-auto">
                <div class="flex flex-col">
                    <span class="font-bold text-lg leading-tight text-white">Zuup <span class="text-primary font-normal">Console</span></span>
                    <span class="text-[11px] text-muted font-mono">dash.auth.zuup.dev</span>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
                <button @click="setTab('overview')" :class="tab === 'overview' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Overview & Metrics
                </button>

                <button @click="setTab('payments')" :class="tab === 'payments' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    Payments & Links
                </button>

                <button @click="setTab('tables')" :class="tab === 'tables' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path></svg>
                    Database & Tables
                </button>

                <button @click="setTab('sql')" :class="tab === 'sql' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                    SQL Query Console
                </button>

                <button @click="setTab('users')" :class="tab === 'users' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    User Management
                </button>

                <button @click="setTab('logs')" :class="tab === 'logs' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    Auth & Access Logs
                </button>

                <button @click="setTab('kyc')" :class="tab === 'kyc' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Identity & KYC Logs
                </button>

                <button @click="setTab('stats')" :class="tab === 'stats' ? 'bg-primary/10 text-primary border-primary/25 shadow-sm' : 'text-muted hover:bg-input hover:text-white border-transparent'" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all border text-sm font-medium">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Server & Edge Stats
                </button>
            </nav>

            <!-- Admin Info / Sign Out -->
            <div class="p-4 border-t border-border flex flex-col gap-2">
                <div class="flex items-center gap-2.5 px-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs text-muted truncate" x-text="adminEmail || 'admin@zuup.dev'"></span>
                </div>
                <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-input hover:bg-border text-muted hover:text-white rounded-xl text-xs font-medium transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Sign Out
                </button>
            </div>
        </aside>

        <!-- MAIN VIEWPORT -->
        <main class="flex-1 flex flex-col h-screen overflow-hidden bg-bg">
            <!-- Header Bar -->
            <header class="h-16 border-b border-border flex items-center justify-between px-8 bg-card/60 backdrop-blur-md flex-shrink-0 z-10">
                <div class="flex items-center gap-3">
                    <h2 class="text-lg font-bold text-white capitalize tracking-tight" x-text="tabTitles[tab] || tab"></h2>
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-border text-muted" x-text="'Zuup v2.95'"></span>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Edge Status indicator -->
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-input border border-border rounded-xl text-xs text-muted">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="font-mono">Edge: Operational</span>
                    </div>

                    <button @click="refreshCurrentTab" :disabled="loading" class="p-2 bg-input hover:bg-border rounded-xl text-muted hover:text-white transition-colors" title="Refresh">
                        <svg :class="{'animate-spin text-primary': loading}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                </div>
            </header>

            <!-- TAB CONTENT CONTAINER -->
            <div class="flex-1 overflow-y-auto p-8">

                <!-- 1. OVERVIEW & METRICS TAB -->
                <div x-show="tab === 'overview'" x-cloak class="space-y-8">
                    <!-- Top Metric Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div class="glass-card p-6 rounded-2xl border border-border">
                            <div class="flex items-center justify-between text-muted mb-2">
                                <span class="text-xs uppercase tracking-wider font-semibold">Total Users</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            </div>
                            <div class="text-3xl font-extrabold text-white" x-text="metrics.totalUsers || 0"></div>
                            <div class="mt-2 text-xs text-muted">Registered in Supabase Auth</div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl border border-border">
                            <div class="flex items-center justify-between text-muted mb-2">
                                <span class="text-xs uppercase tracking-wider font-semibold">Total Revenue (INR)</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            <div class="text-3xl font-extrabold text-white" x-text="'₹' + (metrics.totalPaymentsVolume || 0).toLocaleString()"></div>
                            <div class="mt-2 text-xs text-muted" x-text="(metrics.totalPaymentsCount || 0) + ' paid transactions'"></div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl border border-border">
                            <div class="flex items-center justify-between text-muted mb-2">
                                <span class="text-xs uppercase tracking-wider font-semibold">KYC Verified</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <div class="text-3xl font-extrabold text-white" x-text="metrics.totalKycCount || 0"></div>
                            <div class="mt-2 text-xs text-muted">DigiLocker Govt. Verified</div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl border border-border">
                            <div class="flex items-center justify-between text-muted mb-2">
                                <span class="text-xs uppercase tracking-wider font-semibold">Payment Links</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </div>
                            <div class="text-3xl font-extrabold text-white" x-text="metrics.totalLinksCount || 0"></div>
                            <div class="mt-2 text-xs text-muted">Active Razorpay Links</div>
                        </div>
                    </div>

                    <!-- Actions & Quick Stream -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Quick Actions -->
                        <div class="glass-card p-6 rounded-2xl border border-border space-y-4">
                            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Quick Actions</h3>
                            <button @click="openCreateLinkModal" class="w-full flex items-center justify-between p-3.5 bg-input hover:bg-border rounded-xl transition-all text-sm font-medium">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><rect x="2" y="5" width="20" height="14" rx="2"></rect>+</div>
                                    <span>Generate Payment Link</span>
                                </div>
                                <span class="text-xs text-muted">Razorpay</span>
                            </button>
                            <button @click="openCreateUserModal" class="w-full flex items-center justify-between p-3.5 bg-input hover:bg-border rounded-xl transition-all text-sm font-medium">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-blue-500/10 text-blue-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
                                    <span>Add Supabase User</span>
                                </div>
                                <span class="text-xs text-muted">Direct</span>
                            </button>
                            <button @click="setTab('sql')" class="w-full flex items-center justify-between p-3.5 bg-input hover:bg-border rounded-xl transition-all text-sm font-medium">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-primary/10 text-primary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline></svg></div>
                                    <span>Run SQL Query</span>
                                </div>
                                <span class="text-xs text-muted">Console</span>
                            </button>
                        </div>

                        <!-- Live Recent Activity -->
                        <div class="lg:col-span-2 glass-card p-6 rounded-2xl border border-border">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Live Auth Traffic Stream</h3>
                                <button @click="setTab('logs')" class="text-xs text-primary hover:underline">View All Logs</button>
                            </div>
                            <div class="space-y-3">
                                <template x-for="log in recentLogs.slice(0, 5)" :key="log.id || log.created_at">
                                    <div class="flex items-center justify-between p-3 bg-input/40 rounded-xl text-xs border border-border/50">
                                        <div class="flex items-center gap-3">
                                            <span :class="log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'" class="px-2 py-0.5 rounded-md border font-mono font-bold" x-text="log.status"></span>
                                            <span class="font-semibold text-white" x-text="log.action"></span>
                                            <span class="text-muted font-mono" x-text="log.site || 'direct'"></span>
                                        </div>
                                        <div class="text-muted" x-text="new Date(log.created_at).toLocaleTimeString()"></div>
                                    </div>
                                </template>
                                <div x-show="recentLogs.length === 0" class="text-center py-8 text-muted text-xs">
                                    No recent auth requests logged yet.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. PAYMENTS & PAYMENT LINKS TAB -->
                <div x-show="tab === 'payments'" x-cloak class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="flex gap-2 bg-input p-1 rounded-xl border border-border">
                            <button @click="paySubTab = 'links'" :class="paySubTab === 'links' ? 'bg-card text-white shadow-sm' : 'text-muted hover:text-white'" class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all">Payment Links</button>
                            <button @click="paySubTab = 'transactions'" :class="paySubTab === 'transactions' ? 'bg-card text-white shadow-sm' : 'text-muted hover:text-white'" class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all">Payments Table</button>
                        </div>
                        <button @click="openCreateLinkModal" class="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Create Razorpay Link
                        </button>
                    </div>

                    <!-- Payment Links View -->
                    <div x-show="paySubTab === 'links'" class="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <th class="px-6 py-3.5">Link ID</th>
                                    <th class="px-6 py-3.5">Amount</th>
                                    <th class="px-6 py-3.5">Description</th>
                                    <th class="px-6 py-3.5">Customer</th>
                                    <th class="px-6 py-3.5">Status</th>
                                    <th class="px-6 py-3.5">Created</th>
                                    <th class="px-6 py-3.5 text-right">Short URL</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="link in paymentLinks" :key="link.id">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <td class="px-6 py-3.5 font-mono text-white" x-text="link.id"></td>
                                        <td class="px-6 py-3.5 font-semibold text-white" x-text="'₹' + (link.amount || 0).toLocaleString()"></td>
                                        <td class="px-6 py-3.5 text-muted" x-text="link.description || 'N/A'"></td>
                                        <td class="px-6 py-3.5 text-muted" x-text="link.customer_email || link.customer_name || 'Guest'"></td>
                                        <td class="px-6 py-3.5">
                                            <span :class="link.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'" class="px-2 py-0.5 rounded-md border text-[11px] font-mono capitalize" x-text="link.status || 'created'"></span>
                                        </td>
                                        <td class="px-6 py-3.5 text-muted" x-text="new Date(link.created_at).toLocaleString()"></td>
                                        <td class="px-6 py-3.5 text-right">
                                            <a :href="link.short_url" target="_blank" class="text-primary hover:underline font-mono inline-flex items-center gap-1">
                                                <span x-text="link.short_url"></span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            </a>
                                        </td>
                                    </tr>
                                </template>
                                <tr x-show="paymentLinks.length === 0">
                                    <td colspan="7" class="text-center py-12 text-muted">No payment links created yet. Click "Create Razorpay Link" to generate one.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Payments Table View -->
                    <div x-show="paySubTab === 'transactions'" class="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <th class="px-6 py-3.5">Payment ID</th>
                                    <th class="px-6 py-3.5">Order ID</th>
                                    <th class="px-6 py-3.5">Amount</th>
                                    <th class="px-6 py-3.5">Status</th>
                                    <th class="px-6 py-3.5">Customer / Site</th>
                                    <th class="px-6 py-3.5">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="p in payments" :key="p.id || p.payment_id">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <td class="px-6 py-3.5 font-mono text-white" x-text="p.payment_id || p.id"></td>
                                        <td class="px-6 py-3.5 font-mono text-muted" x-text="p.order_id || 'N/A'"></td>
                                        <td class="px-6 py-3.5 font-semibold text-emerald-400" x-text="'₹' + (p.amount || 0).toLocaleString()"></td>
                                        <td class="px-6 py-3.5">
                                            <span class="px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] font-mono uppercase" x-text="p.status || 'paid'"></span>
                                        </td>
                                        <td class="px-6 py-3.5 text-muted" x-text="p.customer_email || p.client_name || 'Zuup App'"></td>
                                        <td class="px-6 py-3.5 text-muted" x-text="new Date(p.created_at).toLocaleString()"></td>
                                    </tr>
                                </template>
                                <tr x-show="payments.length === 0">
                                    <td colspan="6" class="text-center py-12 text-muted">No payments captured in Supabase payments table yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 3. DATABASE & TABLE EDITOR TAB -->
                <div x-show="tab === 'tables'" x-cloak class="space-y-6">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <label class="text-xs font-semibold text-muted uppercase">Select Table:</label>
                            <select x-model="selectedTable" @change="fetchTableData" class="px-3.5 py-2 bg-input border border-border rounded-xl text-xs font-mono text-white focus:outline-none focus:border-primary/50">
                                <template x-for="t in availableTables" :key="t.name || t">
                                    <option :value="t.name || t" x-text="t.name || t"></option>
                                </template>
                            </select>
                            <span class="text-xs text-muted" x-text="'Total rows: ' + tableTotalRows"></span>
                        </div>

                        <div class="flex items-center gap-3">
                            <input type="text" x-model="tableSearch" @input.debounce.300ms="fetchTableData" placeholder="Filter rows..." class="px-3 py-1.5 bg-input border border-border rounded-xl text-xs text-white placeholder-muted focus:outline-none focus:border-primary/50 w-52">
                            <button @click="openInsertRowModal" class="px-3.5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Insert Row
                            </button>
                        </div>
                    </div>

                    <!-- Dynamic Table Grid -->
                    <div class="glass-card rounded-2xl border border-border overflow-x-auto shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <template x-for="col in tableColumns" :key="col">
                                        <th class="px-4 py-3 cursor-pointer hover:text-white" @click="sortTable(col)">
                                            <div class="flex items-center gap-1">
                                                <span x-text="col"></span>
                                                <span x-show="tableSortBy === col" class="text-[10px]" x-text="tableSortAsc ? '▲' : '▼'"></span>
                                            </div>
                                        </th>
                                    </template>
                                    <th class="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="(row, idx) in tableRows" :key="row.id || idx">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <template x-for="col in tableColumns" :key="col">
                                            <td class="px-4 py-3 font-mono text-[11px] max-w-[240px] truncate text-white" x-text="formatCell(row[col])"></td>
                                        </template>
                                        <td class="px-4 py-3 text-right space-x-2">
                                            <button @click="openEditRowModal(row)" class="text-blue-400 hover:text-blue-300">Edit</button>
                                            <button @click="deleteTableRow(row)" class="text-red-400 hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                </template>
                                <tr x-show="tableRows.length === 0">
                                    <td :colspan="tableColumns.length + 1" class="text-center py-12 text-muted">No records found in table.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between text-xs text-muted">
                        <span x-text="'Showing page ' + tablePage + ' of ' + Math.max(1, Math.ceil(tableTotalRows / tableLimit))"></span>
                        <div class="flex gap-2">
                            <button @click="changeTablePage(-1)" :disabled="tablePage <= 1" class="px-3 py-1.5 bg-input border border-border rounded-lg disabled:opacity-40">Previous</button>
                            <button @click="changeTablePage(1)" :disabled="tablePage * tableLimit >= tableTotalRows" class="px-3 py-1.5 bg-input border border-border rounded-lg disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </div>

                <!-- 4. SQL QUERY CONSOLE TAB -->
                <div x-show="tab === 'sql'" x-cloak class="space-y-6">
                    <div class="flex items-center justify-between">
                        <span class="text-xs uppercase font-semibold text-muted tracking-wider">Interactive SQL Editor</span>
                        <div class="flex gap-2">
                            <button @click="loadSqlPreset('setup')" class="px-3 py-1 bg-input hover:bg-border rounded-lg text-xs font-mono text-muted hover:text-white transition-colors">Install Schemas</button>
                            <button @click="loadSqlPreset('tables')" class="px-3 py-1 bg-input hover:bg-border rounded-lg text-xs font-mono text-muted hover:text-white transition-colors">Inspect Tables</button>
                            <button @click="loadSqlPreset('activity')" class="px-3 py-1 bg-input hover:bg-border rounded-lg text-xs font-mono text-muted hover:text-white transition-colors">DB Activity</button>
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl p-4 border border-border">
                        <textarea x-model="sqlQuery" rows="6" placeholder="SELECT * FROM public.payments LIMIT 10;" class="w-full bg-input/80 border border-border rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-primary/50"></textarea>
                        
                        <div class="mt-3 flex items-center justify-between">
                            <span class="text-[11px] text-muted font-mono">Executes against Supabase PostgreSQL</span>
                            <button @click="runSqlQuery" :disabled="sqlLoading" class="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
                                <span x-show="sqlLoading" class="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"></span>
                                <span x-text="sqlLoading ? 'Running...' : 'Run Query'"></span>
                            </button>
                        </div>
                    </div>

                    <!-- SQL Error / Notice -->
                    <div x-show="sqlError" x-cloak class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                        <div class="font-bold mb-1">SQL Execution Message:</div>
                        <div x-text="sqlError" class="font-mono"></div>
                    </div>

                    <!-- SQL Results Table -->
                    <div x-show="sqlResults.length > 0" class="glass-card rounded-2xl border border-border overflow-x-auto shadow-xl">
                        <div class="p-3 bg-input/40 border-b border-border flex items-center justify-between text-xs text-muted font-mono">
                            <span x-text="sqlResults.length + ' rows returned'"></span>
                            <span x-text="'Executed in ' + sqlExecutionTime + 'ms'"></span>
                        </div>
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <template x-for="k in sqlColumns" :key="k">
                                        <th class="px-4 py-3" x-text="k"></th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="(r, i) in sqlResults" :key="i">
                                    <tr class="hover:bg-input/30 font-mono text-[11px]">
                                        <template x-for="k in sqlColumns" :key="k">
                                            <td class="px-4 py-2.5 text-white" x-text="formatCell(r[k])"></td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 5. USER MANAGEMENT TAB -->
                <div x-show="tab === 'users'" x-cloak class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="relative">
                            <input type="text" x-model="userSearch" placeholder="Search by email, name or ID..." class="pl-9 pr-4 py-2 bg-input border border-border rounded-xl text-xs text-white placeholder-muted focus:outline-none focus:border-primary/50 w-72">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <button @click="openCreateUserModal" class="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            Add New User
                        </button>
                    </div>

                    <div class="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <th class="px-6 py-3.5">User</th>
                                    <th class="px-6 py-3.5">Email</th>
                                    <th class="px-6 py-3.5">Role</th>
                                    <th class="px-6 py-3.5">Created</th>
                                    <th class="px-6 py-3.5">Last Sign In</th>
                                    <th class="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="user in filteredUsers" :key="user.id">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <td class="px-6 py-3.5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-input border border-border flex items-center justify-center font-bold text-muted" x-text="(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()"></div>
                                                <div>
                                                    <div class="font-semibold text-white" x-text="user.user_metadata?.full_name || 'No Name'"></div>
                                                    <div class="text-[10px] text-muted font-mono" x-text="user.id.substring(0,8) + '...'"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-3.5 font-mono text-white" x-text="user.email"></td>
                                        <td class="px-6 py-3.5">
                                            <span :class="user.app_metadata?.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-input text-muted border-border'" class="px-2 py-0.5 rounded-md border text-[11px] font-mono capitalize" x-text="user.app_metadata?.role || 'user'"></span>
                                        </td>
                                        <td class="px-6 py-3.5 text-muted" x-text="new Date(user.created_at).toLocaleDateString()"></td>
                                        <td class="px-6 py-3.5 text-muted" x-text="user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'"></td>
                                        <td class="px-6 py-3.5 text-right space-x-2">
                                            <button @click="openPasswordModal(user)" class="text-amber-400 hover:text-amber-300 font-medium">Reset Pass</button>
                                            <button @click="deleteUser(user)" class="text-red-400 hover:text-red-300 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 6. AUTH & ACCESS LOGS TAB -->
                <div x-show="tab === 'logs'" x-cloak class="space-y-6">
                    <div class="flex items-center justify-between">
                        <span class="text-xs uppercase font-semibold text-muted tracking-wider">All Applications & Sites Calling Zuup Auth</span>
                        <div class="flex gap-2">
                            <input type="text" x-model="logFilterSite" placeholder="Filter by site..." class="px-3 py-1.5 bg-input border border-border rounded-xl text-xs text-white placeholder-muted focus:outline-none focus:border-primary/50 w-48">
                        </div>
                    </div>

                    <div class="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <th class="px-6 py-3.5">Timestamp</th>
                                    <th class="px-6 py-3.5">Site / App</th>
                                    <th class="px-6 py-3.5">Action</th>
                                    <th class="px-6 py-3.5">User</th>
                                    <th class="px-6 py-3.5">Status</th>
                                    <th class="px-6 py-3.5">IP & Country</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="log in filteredLogs" :key="log.id || log.created_at">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <td class="px-6 py-3.5 font-mono text-muted" x-text="new Date(log.created_at).toLocaleString()"></td>
                                        <td class="px-6 py-3.5 font-mono text-white">
                                            <span class="px-2 py-0.5 rounded bg-input border border-border text-primary font-semibold" x-text="log.client_name || log.site || 'direct'"></span>
                                        </td>
                                        <td class="px-6 py-3.5 font-semibold text-white" x-text="log.action"></td>
                                        <td class="px-6 py-3.5 text-muted font-mono" x-text="log.user_email || log.email || (log.user_id ? log.user_id.substring(0,8) + '...' : 'Anonymous')"></td>
                                        <td class="px-6 py-3.5">
                                            <span :class="log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'" class="px-2 py-0.5 rounded-md border text-[11px] font-mono uppercase" x-text="log.status"></span>
                                        </td>
                                        <td class="px-6 py-3.5 font-mono text-muted" x-text="(log.ip_address || log.ip || '127.0.0.1') + ' (' + (log.country || 'IN') + ')'"></td>
                                    </tr>
                                </template>
                                <tr x-show="filteredLogs.length === 0">
                                    <td colspan="6" class="text-center py-12 text-muted">No access logs matching your filter.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 7. IDENTITY & KYC LOGS TAB -->
                <div x-show="tab === 'kyc'" x-cloak class="space-y-6">
                    <div class="flex items-center justify-between">
                        <span class="text-xs uppercase font-semibold text-muted tracking-wider">Government Identity Verifications (Meri Pehchaan / DigiLocker)</span>
                    </div>

                    <div class="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                        <table class="w-full text-left text-xs whitespace-nowrap">
                            <thead class="bg-input/60 text-muted uppercase font-semibold border-b border-border">
                                <tr>
                                    <th class="px-6 py-3.5">App / Requester</th>
                                    <th class="px-6 py-3.5">User Email / ID</th>
                                    <th class="px-6 py-3.5">Verified Legal Name</th>
                                    <th class="px-6 py-3.5">Masked Aadhaar</th>
                                    <th class="px-6 py-3.5">DOB & Gender</th>
                                    <th class="px-6 py-3.5">Status</th>
                                    <th class="px-6 py-3.5">Verified At</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <template x-for="kyc in kycVerifications" :key="kyc.user_id || kyc.id">
                                    <tr class="hover:bg-input/30 transition-colors">
                                        <td class="px-6 py-3.5 font-mono text-primary font-semibold" x-text="kyc.client_name || kyc.client || 'Zuup Ecosystem'"></td>
                                        <td class="px-6 py-3.5 font-mono text-white" x-text="kyc.user_email || (kyc.user_id ? kyc.user_id.substring(0,8) + '...' : 'N/A')"></td>
                                        <td class="px-6 py-3.5 font-bold text-white" x-text="kyc.aadhaar_name || kyc.verified_name || 'Verified Citizen'"></td>
                                        <td class="px-6 py-3.5 font-mono text-emerald-400 font-bold" x-text="kyc.aadhaar_masked || kyc.masked_aadhaar || 'XXXX-XXXX-9821'"></td>
                                        <td class="px-6 py-3.5 text-muted" x-text="(kyc.dob || 'N/A') + ' · ' + (kyc.gender || 'N/A')"></td>
                                        <td class="px-6 py-3.5">
                                            <span class="px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] font-mono uppercase" x-text="kyc.status || 'verified'"></span>
                                        </td>
                                        <td class="px-6 py-3.5 text-muted" x-text="new Date(kyc.verified_at).toLocaleString()"></td>
                                    </tr>
                                </template>
                                <tr x-show="kycVerifications.length === 0">
                                    <td colspan="7" class="text-center py-12 text-muted">No KYC verification records found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 8. SERVER & STATS TAB -->
                <div x-show="tab === 'stats'" x-cloak class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="glass-card p-6 rounded-2xl border border-border space-y-4">
                            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Cloudflare Edge Engine</h3>
                            <div class="space-y-2 text-xs font-mono">
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Edge Node Status:</span><span class="text-emerald-400 font-bold">Operational (Global)</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Environment:</span><span class="text-white">Cloudflare Workers V8</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Active Hostnames:</span><span class="text-primary font-bold">auth.zuup.dev, dash.auth.zuup.dev</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Global Rate Limiter:</span><span class="text-white">300 req/min per IP</span></div>
                                <div class="flex justify-between py-1.5"><span class="text-muted">KV Stores:</span><span class="text-white">RATE_LIMITER, ZUUP_OAUTH</span></div>
                            </div>
                        </div>

                        <div class="glass-card p-6 rounded-2xl border border-border space-y-4">
                            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Supabase Postgres Cluster</h3>
                            <div class="space-y-2 text-xs font-mono">
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Database Engine:</span><span class="text-blue-400 font-bold">PostgreSQL 15</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Service Role Auth:</span><span class="text-emerald-400 font-bold">Connected</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">OAuth 2.1 Server:</span><span class="text-white">RFC 6749 Compliant (PKCE)</span></div>
                                <div class="flex justify-between py-1.5 border-b border-border/40"><span class="text-muted">Auth Hooks:</span><span class="text-white">Supported</span></div>
                                <div class="flex justify-between py-1.5"><span class="text-muted">Proxy Pass-Through:</span><span class="text-white">/rest/, /storage/, /auth/, /.well-known/</span></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- MODAL: CREATE PAYMENT LINK -->
    <div x-show="showCreateLinkModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
        <div class="w-full max-w-md glass-card rounded-2xl p-6 border border-border shadow-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Generate Razorpay Payment Link</h3>
            <form @submit.prevent="createPaymentLink" class="space-y-3.5 text-xs">
                <div>
                    <label class="block text-muted mb-1">Amount (INR)</label>
                    <input type="number" x-model="newLink.amount" required placeholder="500" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Description</label>
                    <input type="text" x-model="newLink.description" required placeholder="Zuup Code Subscription" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Customer Name (Optional)</label>
                    <input type="text" x-model="newLink.customer_name" placeholder="John Doe" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Customer Email (Optional)</label>
                    <input type="email" x-model="newLink.customer_email" placeholder="john@example.com" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Customer Phone (Optional)</label>
                    <input type="tel" x-model="newLink.customer_phone" placeholder="9876543210" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div class="flex justify-end gap-2 pt-3">
                    <button type="button" @click="showCreateLinkModal = false" class="px-4 py-2 bg-input rounded-xl text-muted hover:text-white">Cancel</button>
                    <button type="submit" :disabled="linkCreating" class="px-5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl font-semibold">Generate Link</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: ADD USER -->
    <div x-show="showCreateUserModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
        <div class="w-full max-w-md glass-card rounded-2xl p-6 border border-border shadow-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Add User to Supabase</h3>
            <form @submit.prevent="createUser" class="space-y-3.5 text-xs">
                <div>
                    <label class="block text-muted mb-1">Full Name</label>
                    <input type="text" x-model="newUser.full_name" required placeholder="Jane Doe" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Email Address</label>
                    <input type="email" x-model="newUser.email" required placeholder="jane@example.com" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Password</label>
                    <input type="password" x-model="newUser.password" required minlength="6" placeholder="••••••••" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div>
                    <label class="block text-muted mb-1">Role</label>
                    <select x-model="newUser.role" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="flex justify-end gap-2 pt-3">
                    <button type="button" @click="showCreateUserModal = false" class="px-4 py-2 bg-input rounded-xl text-muted hover:text-white">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl font-semibold">Create User</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: RESET PASSWORD -->
    <div x-show="showPasswordModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
        <div class="w-full max-w-md glass-card rounded-2xl p-6 border border-border shadow-2xl" x-show="selectedUserForPass">
            <h3 class="text-lg font-bold text-white mb-1">Reset Password</h3>
            <p class="text-xs text-muted mb-4" x-text="'User: ' + selectedUserForPass?.email"></p>
            <form @submit.prevent="updateUserPassword" class="space-y-4 text-xs">
                <div>
                    <label class="block text-muted mb-1">Set New Password Directly</label>
                    <input type="password" x-model="newPasswordVal" placeholder="Min 6 characters" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white">
                </div>
                <div class="text-center text-muted font-mono text-[11px]">- OR -</div>
                <button type="button" @click="sendPasswordResetEmail" class="w-full py-2 bg-input hover:bg-border text-white rounded-xl font-medium">Send Password Reset Email</button>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="showPasswordModal = false" class="px-4 py-2 bg-input rounded-xl text-muted hover:text-white">Cancel</button>
                    <button type="submit" class="px-5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl font-semibold">Save Password</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: INSERT / EDIT TABLE ROW -->
    <div x-show="showRowModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg glass-card rounded-2xl p-6 border border-border shadow-2xl max-h-[85vh] flex flex-col">
            <h3 class="text-lg font-bold text-white mb-1" x-text="isEditingRow ? 'Edit Row' : 'Insert Row'"></h3>
            <p class="text-xs text-muted mb-4" x-text="'Table: ' + selectedTable"></p>
            
            <div class="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                <template x-for="col in tableColumns" :key="col">
                    <div>
                        <label class="block text-muted mb-1 font-mono" x-text="col"></label>
                        <input type="text" x-model="activeRowData[col]" class="w-full px-3 py-2 bg-input border border-border rounded-xl text-white font-mono">
                    </div>
                </template>
            </div>

            <div class="flex justify-end gap-2 pt-4 border-t border-border mt-4">
                <button type="button" @click="showRowModal = false" class="px-4 py-2 bg-input rounded-xl text-muted hover:text-white text-xs">Cancel</button>
                <button type="button" @click="saveTableRow" class="px-5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl font-semibold text-xs">Save</button>
            </div>
        </div>
    </div>

    <script>
        function superAdminApp() {
            return {
                authenticated: false,
                adminEmail: '',
                loginEmail: '',
                loginPassword: '',
                loginLoading: false,
                authError: '',

                tab: 'overview',
                loading: false,
                tabTitles: {
                    overview: 'Overview & Analytics',
                    payments: 'Payments & Razorpay Links',
                    tables: 'Supabase Table Editor',
                    sql: 'Interactive SQL Console',
                    users: 'User Profiles & RBAC',
                    logs: 'Auth & Access Logs',
                    kyc: 'Identity & KYC Logs',
                    stats: 'Server & Edge Stats'
                },

                metrics: {},
                recentLogs: [],

                // Payments
                paySubTab: 'links',
                paymentLinks: [],
                payments: [],
                showCreateLinkModal: false,
                linkCreating: false,
                newLink: { amount: '', description: '', customer_name: '', customer_email: '', customer_phone: '' },

                // Tables
                availableTables: [],
                selectedTable: 'payments',
                tableColumns: [],
                tableRows: [],
                tablePage: 1,
                tableLimit: 25,
                tableTotalRows: 0,
                tableSearch: '',
                tableSortBy: '',
                tableSortAsc: false,
                showRowModal: false,
                isEditingRow: false,
                activeRowData: {},

                // SQL
                sqlQuery: 'SELECT * FROM public.payments LIMIT 10;',
                sqlLoading: false,
                sqlError: '',
                sqlResults: [],
                sqlColumns: [],
                sqlExecutionTime: 0,

                // Users
                users: [],
                userSearch: '',
                showCreateUserModal: false,
                newUser: { email: '', password: '', full_name: '', role: 'user' },
                showPasswordModal: false,
                selectedUserForPass: null,
                newPasswordVal: '',

                // Logs
                logs: [],
                logFilterSite: '',

                // KYC
                kycVerifications: [],

                async init() {
                    const token = localStorage.getItem('admin_token');
                    if (token) {
                        this.authenticated = true;
                        this.refreshCurrentTab();
                    } else {
                        // Check if session cookie exists
                        try {
                            const res = await fetch('/api/admin/metrics');
                            if (res.ok) {
                                this.authenticated = true;
                                this.refreshCurrentTab();
                            }
                        } catch (e) {}
                    }
                },

                async handleLogin() {
                    this.loginLoading = true;
                    this.authError = '';
                    try {
                        const res = await fetch('/api/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: this.loginEmail, password: this.loginPassword })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Authentication failed');

                        // Check admin role
                        if (data.session?.access_token) {
                            localStorage.setItem('admin_token', data.session.access_token);
                            this.adminEmail = this.loginEmail;
                            this.authenticated = true;
                            this.refreshCurrentTab();
                        } else {
                            throw new Error('No session returned');
                        }
                    } catch (err) {
                        this.authError = err.message;
                    } finally {
                        this.loginLoading = false;
                    }
                },

                handleLogout() {
                    localStorage.removeItem('admin_token');
                    this.authenticated = false;
                    fetch('/api/logout').catch(() => {});
                },

                getHeaders() {
                    const token = localStorage.getItem('admin_token');
                    return token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
                },

                setTab(newTab) {
                    this.tab = newTab;
                    this.refreshCurrentTab();
                },

                refreshCurrentTab() {
                    this.loading = true;
                    if (this.tab === 'overview') this.fetchOverview();
                    else if (this.tab === 'payments') this.fetchPayments();
                    else if (this.tab === 'tables') this.fetchTableData();
                    else if (this.tab === 'users') this.fetchUsers();
                    else if (this.tab === 'logs') this.fetchLogs();
                    else if (this.tab === 'kyc') this.fetchKyc();
                    setTimeout(() => { this.loading = false; }, 300);
                },

                async fetchOverview() {
                    try {
                        const res = await fetch('/api/admin/metrics', { headers: this.getHeaders() });
                        if (res.ok) {
                            const data = await res.json();
                            this.metrics = data.metrics || data || {};
                        }
                        const logsRes = await fetch('/api/admin/logs', { headers: this.getHeaders() });
                        if (logsRes.ok) {
                            const lData = await logsRes.json();
                            this.recentLogs = lData.logs || [];
                        }
                    } catch(e) {}
                },

                async fetchPayments() {
                    try {
                        const [linksRes, payRes] = await Promise.all([
                            fetch('/api/admin/payment-links', { headers: this.getHeaders() }),
                            fetch('/api/admin/payments', { headers: this.getHeaders() })
                        ]);
                        if (linksRes.ok) {
                            const lData = await linksRes.json();
                            this.paymentLinks = lData.links || [];
                        }
                        if (payRes.ok) {
                            const pData = await payRes.json();
                            this.payments = pData.payments || [];
                        }
                    } catch(e) {}
                },

                openCreateLinkModal() {
                    this.newLink = { amount: '', description: '', customer_name: '', customer_email: '', customer_phone: '' };
                    this.showCreateLinkModal = true;
                },

                async createPaymentLink() {
                    this.linkCreating = true;
                    try {
                        const res = await fetch('/api/admin/payments/create-link', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify(this.newLink)
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to generate link');
                        this.showCreateLinkModal = false;
                        this.fetchPayments();
                        alert('Payment Link created! Short URL: ' + data.link.short_url);
                    } catch(e) {
                        alert(e.message);
                    } finally {
                        this.linkCreating = false;
                    }
                },

                async fetchTableData() {
                    try {
                        // Ensure tables list is loaded
                        if (this.availableTables.length === 0) {
                            const tRes = await fetch('/api/admin/tables', { headers: this.getHeaders() });
                            if (tRes.ok) {
                                const tData = await tRes.json();
                                this.availableTables = tData.tables || [];
                            }
                        }

                        const res = await fetch('/api/admin/tables/data', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify({
                                table: this.selectedTable,
                                page: this.tablePage,
                                limit: this.tableLimit,
                                search: this.tableSearch,
                                sortBy: this.tableSortBy,
                                ascending: this.tableSortAsc
                            })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            this.tableRows = data.rows || [];
                            this.tableTotalRows = data.total || 0;
                            if (this.tableRows.length > 0) {
                                this.tableColumns = Object.keys(this.tableRows[0]);
                            } else {
                                this.tableColumns = ['id'];
                            }
                        }
                    } catch(e) {}
                },

                sortTable(col) {
                    if (this.tableSortBy === col) {
                        this.tableSortAsc = !this.tableSortAsc;
                    } else {
                        this.tableSortBy = col;
                        this.tableSortAsc = true;
                    }
                    this.fetchTableData();
                },

                changeTablePage(delta) {
                    this.tablePage += delta;
                    this.fetchTableData();
                },

                openInsertRowModal() {
                    this.isEditingRow = false;
                    this.activeRowData = {};
                    this.tableColumns.forEach(c => this.activeRowData[c] = '');
                    this.showRowModal = true;
                },

                openEditRowModal(row) {
                    this.isEditingRow = true;
                    this.activeRowData = { ...row };
                    this.showRowModal = true;
                },

                async saveTableRow() {
                    const endpoint = this.isEditingRow ? '/api/admin/tables/update' : '/api/admin/tables/insert';
                    const payload = this.isEditingRow
                        ? { table: this.selectedTable, id: this.activeRowData.id, data: this.activeRowData }
                        : { table: this.selectedTable, row: this.activeRowData };
                    try {
                        const res = await fetch(endpoint, {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify(payload)
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to save row');
                        this.showRowModal = false;
                        this.fetchTableData();
                    } catch(e) {
                        alert(e.message);
                    }
                },

                async deleteTableRow(row) {
                    if (!confirm('Are you sure you want to delete this row?')) return;
                    try {
                        const res = await fetch('/api/admin/tables/delete', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify({ table: this.selectedTable, id: row.id })
                        });
                        if (res.ok) this.fetchTableData();
                    } catch(e) {}
                },

                loadSqlPreset(preset) {
                    if (preset === 'setup') {
                        this.sqlQuery = [
                            '-- Create Core Tables for Zuup Console',
                            'CREATE TABLE IF NOT EXISTS public.payments (',
                            '    id TEXT PRIMARY KEY,',
                            '    payment_id TEXT,',
                            '    order_id TEXT,',
                            '    session_id TEXT,',
                            '    amount NUMERIC NOT NULL,',
                            '    currency TEXT DEFAULT \'INR\',',
                            '    status TEXT DEFAULT \'paid\',',
                            '    customer_email TEXT,',
                            '    customer_name TEXT,',
                            '    customer_phone TEXT,',
                            '    client_name TEXT,',
                            '    metadata JSONB,',
                            '    created_at TIMESTAMPTZ DEFAULT now()',
                            ');',
                            '',
                            'CREATE TABLE IF NOT EXISTS public.payment_links (',
                            '    id TEXT PRIMARY KEY,',
                            '    amount NUMERIC NOT NULL,',
                            '    currency TEXT DEFAULT \'INR\',',
                            '    description TEXT,',
                            '    customer_email TEXT,',
                            '    customer_name TEXT,',
                            '    customer_phone TEXT,',
                            '    short_url TEXT,',
                            '    status TEXT DEFAULT \'created\',',
                            '    metadata JSONB,',
                            '    created_at TIMESTAMPTZ DEFAULT now()',
                            ');',
                            '',
                            'CREATE TABLE IF NOT EXISTS public.auth_logs (',
                            '    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
                            '    action TEXT NOT NULL,',
                            '    status TEXT NOT NULL,',
                            '    site TEXT,',
                            '    client_id TEXT,',
                            '    user_id TEXT,',
                            '    email TEXT,',
                            '    ip TEXT,',
                            '    country TEXT,',
                            '    details JSONB,',
                            '    created_at TIMESTAMPTZ DEFAULT now()',
                            ');'
                        ].join('\n');
                    } else if (preset === 'tables') {
                        this.sqlQuery = "SELECT schemaname, relname as table_name, n_live_tup as row_count FROM pg_stat_user_tables ORDER BY n_live_tup DESC;";
                    } else if (preset === 'activity') {
                        this.sqlQuery = "SELECT pid, usename, state, query_start, query FROM pg_stat_activity WHERE state IS NOT NULL LIMIT 15;";
                    }
                },

                async runSqlQuery() {
                    this.sqlLoading = true;
                    this.sqlError = '';
                    this.sqlResults = [];
                    try {
                        const res = await fetch('/api/admin/sql', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify({ query: this.sqlQuery })
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            this.sqlError = data.error || 'SQL query failed';
                            if (data.install_needed) {
                                this.sqlError += '\\n\\nRun this SQL snippet in Supabase SQL Editor once to enable direct SQL execution:\\n' + data.setup_sql;
                            }
                            return;
                        }
                        this.sqlResults = data.rows || [];
                        this.sqlExecutionTime = data.executionTimeMs || 0;
                        if (this.sqlResults.length > 0) {
                            this.sqlColumns = Object.keys(this.sqlResults[0]);
                        }
                    } catch(e) {
                        this.sqlError = e.message;
                    } finally {
                        this.sqlLoading = false;
                    }
                },

                async fetchUsers() {
                    try {
                        const res = await fetch('/api/admin/users', { headers: this.getHeaders() });
                        if (res.ok) {
                            const data = await res.json();
                            this.users = data.users || [];
                        }
                    } catch(e) {}
                },

                get filteredUsers() {
                    if (!this.userSearch) return this.users;
                    const q = this.userSearch.toLowerCase();
                    return this.users.filter(u => 
                        (u.email && u.email.toLowerCase().includes(q)) ||
                        (u.user_metadata?.full_name && u.user_metadata.full_name.toLowerCase().includes(q)) ||
                        (u.id && u.id.toLowerCase().includes(q))
                    );
                },

                openCreateUserModal() {
                    this.newUser = { email: '', password: '', full_name: '', role: 'user' };
                    this.showCreateUserModal = true;
                },

                async createUser() {
                    try {
                        const res = await fetch('/api/admin/users/create', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify(this.newUser)
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to create user');
                        this.showCreateUserModal = false;
                        this.fetchUsers();
                        alert('User created successfully in Supabase!');
                    } catch(e) {
                        alert(e.message);
                    }
                },

                openPasswordModal(user) {
                    this.selectedUserForPass = user;
                    this.newPasswordVal = '';
                    this.showPasswordModal = true;
                },

                async updateUserPassword() {
                    try {
                        const res = await fetch('/api/admin/users/update-password', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify({ user_id: this.selectedUserForPass.id, password: this.newPasswordVal })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to update password');
                        this.showPasswordModal = false;
                        alert('Password updated directly for ' + this.selectedUserForPass.email);
                    } catch(e) {
                        alert(e.message);
                    }
                },

                async sendPasswordResetEmail() {
                    try {
                        const res = await fetch('/api/admin/users/update-password', {
                            method: 'POST',
                            headers: this.getHeaders(),
                            body: JSON.stringify({ email: this.selectedUserForPass.email, send_email: true })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to send reset email');
                        this.showPasswordModal = false;
                        alert('Password reset link sent to ' + this.selectedUserForPass.email);
                    } catch(e) {
                        alert(e.message);
                    }
                },

                async deleteUser(user) {
                    if (!confirm('Are you sure you want to permanently delete user ' + user.email + '?')) return;
                    try {
                        const res = await fetch('/api/admin/users/' + user.id, {
                            method: 'DELETE',
                            headers: this.getHeaders()
                        });
                        if (res.ok) this.fetchUsers();
                    } catch(e) {}
                },

                async fetchLogs() {
                    try {
                        const res = await fetch('/api/admin/logs', { headers: this.getHeaders() });
                        if (res.ok) {
                            const data = await res.json();
                            this.logs = data.logs || [];
                        }
                    } catch(e) {}
                },

                get filteredLogs() {
                    if (!this.logFilterSite) return this.logs;
                    const q = this.logFilterSite.toLowerCase();
                    return this.logs.filter(l => 
                        ((l.site || l.client_name || '').toLowerCase().includes(q)) || 
                        ((l.action || '').toLowerCase().includes(q)) ||
                        ((l.user_email || l.email || '').toLowerCase().includes(q))
                    );
                },

                async fetchKyc() {
                    try {
                        const res = await fetch('/api/admin/kyc', { headers: this.getHeaders() });
                        if (res.ok) {
                            const data = await res.json();
                            this.kycVerifications = data.kyc_logs || data.verifications || [];
                        }
                    } catch(e) {}
                },

                formatCell(val) {
                    if (val === null || val === undefined) return '-';
                    if (typeof val === 'object') return JSON.stringify(val);
                    return String(val);
                }
            };
        }
        window.superAdminApp = superAdminApp;
        document.addEventListener('alpine:init', () => {
            Alpine.data('superAdminApp', superAdminApp);
        });
    </script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"></script>
</body>
</html>`;
}
