import React, { useState } from 'react';
import { 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  CreditCard, 
  Wrench, 
  Users2, 
  Globe2, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Sparkles,
  Send,
  Zap,
  BarChart3,
  FileText
} from 'lucide-react';
import { LocariLogo } from '../components/LocariLogo';

interface LandingPageProps {
  onLaunchConsole: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onOpenAuth,
  onOpenSimulator
}) => {
  // Interactive mini WhatsApp assistant preview on the landing page
  const [demoChat, setDemoChat] = useState([
    { sender: 'assistant', text: 'Hello! I am your Locari Property Management Assistant. How can I help you today?' },
    { sender: 'user', text: 'What is the rent status for Adeleke Royal Court?' },
    { sender: 'assistant', text: '📊 Adeleke Royal Court: 3 of 4 units paid (₦2,350,000 collected). Flat 2 has an overdue balance of ₦450,000. Would you like me to send an automated WhatsApp reminder?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoQuickPrompts = [
    'Send rent reminder to Flat 2',
    'Log payment of ₦450,000',
    'Report leaking pipe in Flat 3',
    'Generate landlord statement'
  ];

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;
    const newChat = [...demoChat, { sender: 'user', text }];
    setDemoChat(newChat);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I've updated the central ledger in your Locari Console. All records are synchronized in real-time.";
      const lower = text.toLowerCase();
      if (lower.includes('reminder')) {
        reply = "✅ Polite WhatsApp reminder dispatched to Mr. Babajide (Flat 2). Due balance: ₦450,000. Due date logged.";
      } else if (lower.includes('payment') || lower.includes('450')) {
        reply = "💳 Payment of ₦450,000 recorded for Flat 2. Bank transfer verified. Receipt #REC-9821 generated.";
      } else if (lower.includes('pipe') || lower.includes('leak')) {
        reply = "🔧 Maintenance ticket created: Leaking pipe in Flat 3. Assigned to Lead Plumber. Landlord approval requested.";
      } else if (lower.includes('statement') || lower.includes('report')) {
        reply = "📄 Monthly Statement ready: Total Collection: ₦2,800,000. Management Fee: 10%. Net Payout: ₦2,495,000.";
      }

      setDemoChat([...newChat, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-brand-500 selection:text-black">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-600 via-brand-500 to-amber-600 text-surface-950 px-4 py-2 text-center text-xs font-black tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Experience the next-generation Property Management Operating System • Manage from WhatsApp & Web Console</span>
      </div>

      {/* 2. FLOATING NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <LocariLogo className="h-7 w-auto" badge="PM OS" />
            <div className="hidden md:flex items-center gap-6 text-xs font-bold text-surface-300">
              <a href="#how-it-works" className="hover:text-brand-400 transition-colors">How It Works</a>
              <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
              <a href="#whatsapp" className="hover:text-brand-400 transition-colors">WhatsApp Assistant</a>
              <a href="#who-it-is-for" className="hover:text-brand-400 transition-colors">Who It's For</a>
              <a href="#pricing" className="hover:text-brand-400 transition-colors">Pricing</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-bold text-surface-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 text-xs font-black tracking-wide shadow-lg shadow-brand-500/20 transition-all transform active:scale-95 whitespace-nowrap"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-900 border border-surface-800 text-brand-400 text-xs font-black tracking-wide shadow-sm">
              <Zap className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
              <span>THE ALL-IN-ONE PROPERTY MANAGEMENT OPERATING SYSTEM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tight leading-[1.1] text-white">
              Run Your Properties With Confidence. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-500 to-amber-300">
                From WhatsApp To Web.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-surface-300 max-w-2xl mx-auto leading-relaxed">
              No more lost payment receipts, forgotten rent renewals, or stressful phone calls. Manage buildings, tenants, rent collections, and repairs in real-time — directly on WhatsApp and via a centralized web control console.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-sm tracking-wide shadow-xl shadow-brand-500/25 transition-all transform active:scale-95 inline-flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-900 hover:bg-surface-800 text-white font-bold text-sm border border-surface-700 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Explore Live Console Demo</span>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
              <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800">
                <div className="text-xl sm:text-2xl font-black font-headline text-brand-400">₦450M+</div>
                <div className="text-xs text-surface-400 mt-0.5">Rent Reconciled</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800">
                <div className="text-xl sm:text-2xl font-black font-headline text-white">1,200+</div>
                <div className="text-xs text-surface-400 mt-0.5">Active Units Managed</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800">
                <div className="text-xl sm:text-2xl font-black font-headline text-emerald-400">99.4%</div>
                <div className="text-xs text-surface-400 mt-0.5">On-Time Remittance</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800">
                <div className="text-xl sm:text-2xl font-black font-headline text-brand-400">100%</div>
                <div className="text-xs text-surface-400 mt-0.5">WhatsApp Native</div>
              </div>
            </div>
          </div>

          {/* DUAL INTERFACE PREVIEW SHOWCASE */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Web Console Preview Card */}
            <div className="lg:col-span-7 rounded-3xl bg-surface-900 border border-surface-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-6 border-b border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-bold text-surface-400 ml-2">Locari Central Web Console</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                  LIVE SYSTEM
                </span>
              </div>

              {/* Sample Dashboard Metrics */}
              <div className="grid grid-cols-3 gap-3 my-6">
                <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
                  <span className="text-[10px] text-surface-400 font-bold uppercase">Rent Collected</span>
                  <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">₦2,350,000</div>
                  <span className="text-[10px] text-surface-500">3 of 4 units paid</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
                  <span className="text-[10px] text-surface-400 font-bold uppercase">Occupancy</span>
                  <div className="text-base sm:text-lg font-black text-brand-400 mt-1">87.5%</div>
                  <span className="text-[10px] text-surface-500">7 active tenants</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800">
                  <span className="text-[10px] text-surface-400 font-bold uppercase">Work Orders</span>
                  <div className="text-base sm:text-lg font-black text-amber-400 mt-1">1 Pending</div>
                  <span className="text-[10px] text-surface-500">Plumbing repair</span>
                </div>
              </div>

              {/* Sample Properties List inside card */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-surface-400">Active Portfolios</div>
                <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Adeleke Royal Court</div>
                      <div className="text-[11px] text-surface-400">Bodija, Ibadan • 4 Units</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">₦2.35M / ₦2.8M</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-300">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Williams Heights</div>
                      <div className="text-[11px] text-surface-400">Lekki Phase 1, Lagos • 4 Units</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">₦18.0M Fully Reconciled</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-800 flex items-center justify-between">
                <span className="text-xs text-surface-400">Manage all properties & units effortlessly</span>
                <button
                  onClick={onLaunchConsole}
                  className="text-xs font-black text-brand-400 hover:text-brand-300 inline-flex items-center gap-1.5"
                >
                  <span>Launch Control Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: WhatsApp Assistant Live Frame */}
            <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-surface-800 p-5 shadow-2xl relative">
              {/* WhatsApp Header */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                    L
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Locari Assistant</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    </div>
                    <div className="text-[10px] text-emerald-400">Official WhatsApp Service</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-surface-400 bg-surface-800 px-2 py-0.5 rounded-full">
                  WhatsApp Native
                </span>
              </div>

              {/* Chat Messages */}
              <div className="py-4 space-y-3 min-h-[260px] max-h-[300px] overflow-y-auto pr-1 text-xs">
                {demoChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : 'bg-surface-800 text-surface-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-surface-500 mt-1 px-1">Just now</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-surface-400 text-[11px] bg-surface-800 px-3 py-2 rounded-xl w-fit">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span>Locari is checking ledger...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="pt-3 border-t border-surface-800 space-y-2">
                <div className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                  Try a prompt:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demoQuickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-white transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE OLD WAY VS LOCARI OPERATING SYSTEM */}
      <section className="py-20 bg-surface-950 border-y border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-400">
              WHY PROPERTY MANAGERS & LANDLORDS CHOOSE LOCARI
            </h2>
            <h3 className="text-3xl font-black font-headline text-white">
              Stop Managing Properties Through Chaos
            </h3>
            <p className="text-sm text-surface-400">
              Traditional property management is full of unrecorded calls, missed renewals, and delayed updates. Locari brings order, accountability, and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-surface-900/50 border border-red-500/20 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-black">
                <span>The Fragmented Old Way</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-surface-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Payment receipts lost in flooded WhatsApp chats and gallery screenshots.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Rent due dates forgotten until tenants are already 3 months overdue.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Landlords calling repeatedly for updates and monthly remittance calculations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Unverified repair costs and disputes over who approved plumber or electrician bills.</span>
                </li>
              </ul>
            </div>

            {/* The Locari Way */}
            <div className="p-8 rounded-3xl bg-surface-900 border border-brand-500/30 space-y-5 shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>The Locari Property Operating System</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-surface-100">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automatic WhatsApp Reminders:</strong> Tenants get polite payment notices 30, 14, and 7 days before rent expires.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Verified Payment Ledger:</strong> Track reported receipts versus verified bank credits with zero guesswork.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant Landlord Statements:</strong> Generate and dispatch professional remittance reports directly to landlords on WhatsApp in 1 click.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Seamless Maintenance Approvals:</strong> Capture photo evidence, estimate costs, and get landlord sign-off before money is spent.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-400">
              SIMPLE & POWERFUL WORKFLOW
            </h2>
            <h3 className="text-3xl font-black font-headline text-white">
              How Locari Operates in 3 Simple Steps
            </h3>
            <p className="text-sm text-surface-400">
              No long onboarding or difficult software manuals. You and your team are up and running in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-black text-xl">
                01
              </div>
              <h4 className="text-lg font-black font-headline text-white">Set Up Your Properties</h4>
              <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
                Add your buildings, apartments, and units. Assign tenant lease dates and annual rent amounts in just a few clicks.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-black text-xl">
                02
              </div>
              <h4 className="text-lg font-black font-headline text-white">Operate Through WhatsApp</h4>
              <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
                Tenants and property owners interact naturally with the Locari Assistant to check balances, report repairs, and submit payment proofs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-900 border border-brand-500/40 space-y-4 relative shadow-lg shadow-brand-500/5">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-surface-950 flex items-center justify-center font-black text-xl">
                03
              </div>
              <h4 className="text-lg font-black font-headline text-white">Gain 100% Control</h4>
              <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
                Track full financial ledgers, auto-reconcile bank transfers, and deliver transparent monthly statements to landlords wherever they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section id="features" className="py-20 bg-surface-950 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-400">
              CORE CAPABILITIES
            </h2>
            <h3 className="text-3xl font-black font-headline text-white">
              Everything You Need To Scale Your Portfolio
            </h3>
            <p className="text-sm text-surface-400">
              Built specifically to handle the real-world operational challenges of property management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">Automated Rent & Arrears Tracking</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Tracks annual and monthly rent schedules. Sends automated polite reminders to tenants and prevents unpaid arrears from accumulating.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">WhatsApp Operational Assistant</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Log payments, register properties, and query portfolios directly on WhatsApp in natural language without opening heavy spreadsheets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">Maintenance & Repair Pipeline</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Tenants report issues with photos. Property managers review estimates and send 1-click WhatsApp authorization requests to landlords.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">Tenant & Landlord Profiles</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Centralized records of tenant IDs, emergency contacts, lease agreements, landlord bank payout accounts, and commission structures.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">1-Click Remittance Statements</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Automated monthly statements deducting management fees and approved maintenance, showing net payouts clearly to property owners.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-surface-900 border border-surface-800 space-y-3 hover:border-surface-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black font-headline text-white">Remote & Overseas Property Oversight</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Property owners living outside town or abroad can monitor their rental properties with verified receipts and clear financial reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHO IT IS FOR */}
      <section id="who-it-is-for" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-400">
              DESIGNED FOR YOUR WORKFLOW
            </h2>
            <h3 className="text-3xl font-black font-headline text-white">
              Who Uses Locari Property Management?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black font-headline text-white">Property Managers & Agencies</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Manage multiple buildings and dozens of landlords without missing follow-ups, losing records, or spending hours formatting reports.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black font-headline text-white">Independent Landlords</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Manage your own rental units directly. Automate rent notices, receive payments on time, and keep clean financial records.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black font-headline text-white">Remote Property Owners</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Have peace of mind while away. Receive verified payment updates, view repair proofs, and approve expenses easily on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING PLANS */}
      <section id="pricing" className="py-20 bg-surface-950 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-400">
              PLANS & PRICING
            </h2>
            <h3 className="text-3xl font-black font-headline text-white">
              Start Free, Scale As You Grow
            </h3>
            <p className="text-sm text-surface-400">
              Transparent plans tailored for property managers and landlords of every size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-surface-400">Starter</span>
                <div className="text-3xl font-black font-headline text-white mt-2">₦0 <span className="text-xs text-surface-400 font-normal">/ forever</span></div>
                <p className="text-xs text-surface-400 mt-2">Ideal for independent landlords getting started.</p>
              </div>

              <ul className="space-y-3 text-xs text-surface-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 5 rental units</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Assistant integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Central Web Dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Rent tracking & payment ledger</li>
              </ul>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-xs transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Professional Plan */}
            <div className="p-8 rounded-3xl bg-surface-900 border-2 border-brand-500 space-y-6 shadow-2xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-surface-950 text-[10px] font-black uppercase tracking-wider">
                MOST POPULAR
              </span>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-400">Professional</span>
                <div className="text-3xl font-black font-headline text-white mt-2">₦15,000 <span className="text-xs text-surface-400 font-normal">/ month</span></div>
                <p className="text-xs text-surface-400 mt-2">Built for active property managers and growing portfolios.</p>
              </div>

              <ul className="space-y-3 text-xs text-surface-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Up to 35 rental units</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Automated WhatsApp rent alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Maintenance & work order pipeline</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> 1-Click monthly landlord statements</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Tenant payment receipt verification</li>
              </ul>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs shadow-lg shadow-brand-500/20 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-surface-900 border border-surface-800 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-surface-400">Enterprise Agency</span>
                <div className="text-3xl font-black font-headline text-white mt-2">₦45,000 <span className="text-xs text-surface-400 font-normal">/ month</span></div>
                <p className="text-xs text-surface-400 mt-2">For real estate management companies with large portfolios.</p>
              </div>

              <ul className="space-y-3 text-xs text-surface-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited units & properties</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-staff logins & roles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom WhatsApp business number</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority WhatsApp & phone support</li>
              </ul>

              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-xs transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL HIGH-ENERGY CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-surface-900 via-surface-950 to-surface-900 border border-brand-500/30 text-center space-y-6 shadow-2xl relative">
            <h3 className="text-3xl sm:text-4xl font-black font-headline text-white">
              Ready To Upgrade Your Property Management?
            </h3>
            <p className="text-sm sm:text-base text-surface-300 max-w-xl mx-auto leading-relaxed">
              Join property managers and landlords who use Locari to automate rent collections, streamline maintenance, and keep clean records.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-sm tracking-wide shadow-xl shadow-brand-500/20 transition-all transform active:scale-95"
              >
                Create Account & Launch Console
              </button>
              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-800 hover:bg-surface-700 text-white font-bold text-sm transition-colors"
              >
                Explore Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-surface-800 bg-[#09090b] py-12 text-surface-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <LocariLogo className="h-6 w-auto" badge="PM OS" />
            <span className="text-surface-600 hidden sm:inline">|</span>
            <span>A Locari Technology Platform (www.locari.africa)</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:management@locari.africa" className="hover:text-white transition-colors">management@locari.africa</a>
            <span>•</span>
            <span>Plot 4, Ring Road, Ibadan, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
