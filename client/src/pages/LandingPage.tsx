import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Wallet,
  Zap,
  Lock,
  Sparkles,
  Layers,
  CheckCircle,
  Wifi,
  Globe,
  Vault,
  BarChart3,
  Headphones,
  CreditCard
} from 'lucide-react';
import { SpatialCard } from '../components/common/SpatialCard.js';
import { Button } from '../components/common/Button.js';
import { formatINR } from '../utils/formatters.js';

export const LandingPage: React.FC = () => {
  // Animated Ticker Counter for Sample Card on Landing Page
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const targetBalance = 25000000; // ₹2,50,000.00 in paise (25000000 paise)

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds countup
    const steps = 60;
    const stepTime = duration / steps;
    const increment = targetBalance / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetBalance) {
        setAnimatedBalance(targetBalance);
        clearInterval(timer);
      } else {
        setAnimatedBalance(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030509] text-slate-100 flex flex-col overflow-hidden relative selection:bg-emerald-500/30 selection:text-emerald-300 cosmic-grid">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-500/15 blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between z-20 border-b border-white/10 backdrop-blur-xl bg-space-950/40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-950/60 text-space-950 font-black text-2xl border border-emerald-300">
            BM
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent font-sans">
              Bank of AMR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="secondary" size="md">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-20 z-10 flex flex-col items-center text-center justify-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-space-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-8 shadow-xl shadow-emerald-950/50">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Next-Generation Private Banking Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight md:leading-none mb-6 font-sans">
          Banking, reimagined for the{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            digital spatial era.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-3xl mb-10 leading-relaxed">
          Experience ultra-secure instant money transfers, real-time balance tracking, spatial analytics, and bank-grade protection.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 shadow-2xl shadow-emerald-950/80" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Open Account Now
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              Sign In to Portal
            </Button>
          </Link>
        </div>

        {/* Grandeur Metal Card Visualizer with Countdown Animated Balance & Placeholder Name */}
        <div className="w-full max-w-2xl mb-20 text-left transform hover:scale-[1.02] transition-all duration-500">
          <div className="metal-card rounded-3xl p-8 text-white min-h-[270px] flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center font-black text-space-950 text-xl border border-amber-200 shadow-md">
                  BM
                </div>
                <div>
                  <div className="font-extrabold tracking-widest text-sm uppercase text-slate-100">
                    Bank of AMR
                  </div>
                  <div className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase">
                    VIP RESERVE SAVINGS
                  </div>
                </div>
              </div>
              <Wifi className="w-6 h-6 text-slate-300 rotate-90" />
            </div>

            <div className="my-6 relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-300 tracking-widest block mb-1">
                  AVAILABLE LIQUIDITY
                </span>
                <div className="text-3xl md:text-5xl font-extrabold font-mono text-white tracking-tight drop-shadow-lg">
                  {formatINR(animatedBalance)}
                </div>
              </div>

              {/* Gold Chip Visualizer */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-200 border border-amber-100 flex flex-col justify-between p-1 shadow-md">
                <div className="h-2 border-b border-amber-600/40" />
                <div className="h-2 border-b border-amber-600/40" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs font-mono relative z-10 text-slate-300">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block">CARDHOLDER</span>
                <span className="font-bold text-white uppercase tracking-widest">XXXX XXXX</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block">ACCOUNT NUMBER</span>
                <span className="font-bold text-emerald-300">•••• •••• •••• XXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Real Bank System Feature Cards */}
        <div className="space-y-6 w-full text-left">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
              Institutional Banking Solutions
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Engineered with modern fintech infrastructure for personal and business wealth management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Feature 1: Instant Money Transfer */}
            <SpatialCard hoverable glow="emerald">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/50">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">Instant Money Transfer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Send and receive funds in real time with instant ledger settlement, atomic processing, and complete transaction receipts.
              </p>
            </SpatialCard>

            {/* Feature 2: Multi-Currency Account */}
            <SpatialCard hoverable glow="cyan">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">Multi-Currency Account</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Full Indian Rupee (INR) savings and checking account management with precision integer paise monetary standards.
              </p>
            </SpatialCard>

            {/* Feature 3: Executive Asset Vault */}
            <SpatialCard hoverable glow="gold">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/50">
                <Vault className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">Executive Asset Vault</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                High-yield savings options with capital preservation controls, automated interest tracking, and liquidity reserves.
              </p>
            </SpatialCard>

            {/* Feature 4: 24/7 Security Shield */}
            <SpatialCard hoverable glow="purple">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-950/50">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">24/7 Security Shield</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Server-side audit logging, bcrypt password protection, 5-minute idle timeout safeguards, and active session control.
              </p>
            </SpatialCard>

            {/* Feature 5: Real-Time Financial Analytics */}
            <SpatialCard hoverable glow="emerald">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-lg shadow-teal-950/50">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">Real-Time Financial Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Interactive expenditure breakdowns, visual progress tracking, incoming vs outgoing metrics, and monthly statements.
              </p>
            </SpatialCard>

            {/* Feature 6: Priority VIP Support */}
            <SpatialCard hoverable glow="gold">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4 shadow-lg shadow-amber-950/50">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-100 mb-2">Priority Concierge Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Dedicated support channels for account management, security updates, institutional inquiries, and administrative requests.
              </p>
            </SpatialCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 md:px-12 bg-space-950/90 backdrop-blur-xl text-center text-xs text-slate-500 z-10">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-300 text-sm">
            Bank of AMR — Private Banking Portal
          </p>
          <p className="text-slate-500">
            © 2026 Bank of AMR. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
