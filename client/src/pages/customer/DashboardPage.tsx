import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  CreditCard,
  TrendingUp,
  History,
  ShieldCheck,
  ChevronRight,
  Wifi,
  Sparkles,
  Zap,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { Button } from '../../components/common/Button.js';
import { customerApi } from '../../services/api.js';
import { formatINR, formatDate, maskAccountNumber } from '../../utils/formatters.js';
import { Transaction, Account, User } from '../../types/index.js';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    user: User;
    account: Account;
    recentTransactions: Transaction[];
    stats: {
      totalTransactions: number;
      monthlyOutgoing: number;
      monthlyIncoming: number;
    };
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await customerApi.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, account, recentTransactions, stats } = data;

  const totalVolume = stats.monthlyIncoming + stats.monthlyOutgoing;
  const outgoingPercent = totalVolume > 0 ? Math.round((stats.monthlyOutgoing / totalVolume) * 100) : 0;
  const incomingPercent = totalVolume > 0 ? Math.round((stats.monthlyIncoming / totalVolume) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome Banner with High Contrast Name */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-space-900/95 via-emerald-950/30 to-space-900/95 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Banking Terminal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight drop-shadow-md">
            Welcome back, <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Real-time liquidity overview, instant transfer terminal, and executive ledger.
          </p>
        </div>

        {/* Quick Action Dock */}
        <div className="flex items-center gap-3 relative z-10">
          <Link to="/app/transfer">
            <Button size="lg" className="shadow-xl shadow-emerald-950/60" rightIcon={<Send className="w-4 h-4" />}>
              Send Money
            </Button>
          </Link>
          <Link to="/app/transactions">
            <Button variant="secondary" size="lg" rightIcon={<History className="w-4 h-4" />}>
              Ledger Statement
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Grandeur Metal Credit Card + Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grandeur Metal Card (Span 7) */}
        <div className="lg:col-span-7">
          <div className="metal-card rounded-3xl p-8 text-white min-h-[270px] flex flex-col justify-between relative group hover:scale-[1.01] transition-all duration-300">
            {/* Top Card Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 flex items-center justify-center font-black text-space-950 text-xl shadow-lg border border-amber-200">
                  BM
                </div>
                <div>
                  <div className="font-extrabold tracking-widest text-sm font-sans uppercase text-slate-100">
                    Bank of AMR
                  </div>
                  <div className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase">
                    {account.accountType} VIP RESERVE
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Wifi className="w-6 h-6 opacity-80 rotate-90" />
                <StatusBadge status={account.status} size="sm" />
              </div>
            </div>

            {/* Middle Card: Chip & Balance */}
            <div className="my-6 relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-300 tracking-widest block mb-1">
                  AVAILABLE LIQUIDITY
                </span>
                <div className="text-3xl md:text-5xl font-extrabold font-mono text-white tracking-tight drop-shadow-md">
                  {formatINR(account.balance)}
                </div>
              </div>

              {/* Gold Chip Icon Visualizer */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-200 border border-amber-100 shadow-md flex flex-col justify-between p-1">
                <div className="h-2 border-b border-amber-600/40" />
                <div className="h-2 border-b border-amber-600/40" />
              </div>
            </div>

            {/* Bottom Card Footer with Prominent Name */}
            <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs font-mono relative z-10 text-slate-300">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block">CARDHOLDER</span>
                <span className="font-black text-white tracking-wide uppercase text-sm drop-shadow">{user.name}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block">ACCOUNT NUMBER</span>
                <span className="font-bold text-emerald-300 text-sm">{maskAccountNumber(account.accountNumber)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block">CURRENCY</span>
                <span className="font-bold text-white">INR (₹)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Breakdown Cards (Span 5) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <SpatialCard hoverable className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                Monthly Outgoing Transfers
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">{outgoingPercent}%</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {formatINR(stats.monthlyOutgoing)}
            </div>
            <div className="w-full bg-space-950 h-2.5 rounded-full overflow-hidden mt-4 border border-white/10">
              <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(5, outgoingPercent)}%` }} />
            </div>
          </SpatialCard>

          <SpatialCard hoverable className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                Monthly Incoming Credits
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{incomingPercent}%</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {formatINR(stats.monthlyIncoming)}
            </div>
            <div className="w-full bg-space-950 h-2.5 rounded-full overflow-hidden mt-4 border border-white/10">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(5, incomingPercent)}%` }} />
            </div>
          </SpatialCard>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              Live Activity Stream
            </h2>
            <p className="text-xs text-slate-400">Real-time ledger updates for your account.</p>
          </div>
          <Link to="/app/transactions" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            View Complete History
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <SpatialCard className="text-center py-12 text-slate-400">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium">No transactions recorded yet</p>
            <p className="text-xs text-slate-500 mt-1">Your transfers will appear here instantly after execution.</p>
          </SpatialCard>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((txn) => {
              const isOutgoing = txn.senderAccountId === account.id;
              return (
                <SpatialCard key={txn.id} hoverable className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        isOutgoing
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-950/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-950/30'
                      }`}
                    >
                      {isOutgoing ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {isOutgoing ? `To: ${txn.receiverName}` : `From: ${txn.senderName}`}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{txn.description}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">{txn.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-extrabold font-mono ${isOutgoing ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isOutgoing ? '-' : '+'}{formatINR(txn.amount)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      {formatDate(txn.createdAt)}
                    </div>
                  </div>
                </SpatialCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
