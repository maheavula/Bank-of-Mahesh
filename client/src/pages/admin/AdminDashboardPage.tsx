import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, CreditCard, History, Activity, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { adminApi } from '../../services/api.js';
import { formatINR } from '../../utils/formatters.js';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CardSkeleton />;
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
          Executive Operations Console
        </h1>
        <p className="text-sm text-slate-400">
          Systemic oversight of all Bank of AMR accounts, balances, transactions, and risks.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SpatialCard glow="cyan">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Total Deposits Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white font-mono drop-shadow">
            {formatINR(stats.totalSimulatedBalance)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Sum of all active account deposits</span>
        </SpatialCard>

        <SpatialCard hoverable>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Total Registered Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
            {stats.totalCustomers}
          </div>
          <div className="flex items-center gap-3 text-[11px] mt-2">
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <UserCheck className="w-3 h-3" /> {stats.activeCustomers} Active
            </span>
            <span className="text-rose-400 flex items-center gap-1 font-bold">
              <UserX className="w-3 h-3" /> {stats.suspendedCustomers} Suspended
            </span>
          </div>
        </SpatialCard>

        <SpatialCard hoverable>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Total Transactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
            {stats.totalTransactions}
          </div>
          <span className="text-[11px] text-emerald-400 font-bold mt-2 block">
            +{stats.transactionsToday} transactions today
          </span>
        </SpatialCard>

        <SpatialCard hoverable>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Total Volume Processed
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
            {formatINR(stats.totalVolumePaise)}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Lifetime transfer volume</span>
        </SpatialCard>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpatialCard className="p-6">
          <h3 className="font-extrabold text-white mb-4 flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-cyan-400" />
            Platform Health & Compliance
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">SYSTEM STATUS</span>
              <span className="text-emerald-400 font-bold uppercase">{stats.systemStatus}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">IDLE TIMEOUT SAFEGUARD</span>
              <span className="text-cyan-400 font-bold">5-Minutes Idle Guard</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">LAST SYNC AT</span>
              <span className="text-slate-200">{stats.lastSavedAt}</span>
            </div>
          </div>
        </SpatialCard>

        <SpatialCard className="p-6">
          <h3 className="font-extrabold text-white mb-4 flex items-center gap-2 text-base">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Admin Quick Controls
          </h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            From the navigation sidebar, you can suspend compromised customer accounts, inspect system audit logs, or review all ledger statements.
          </p>
          <div className="flex gap-3">
            <a href="/admin/customers" className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
              Manage Customers →
            </a>
            <a href="/admin/audit" className="px-4 py-2 rounded-xl bg-space-850 text-slate-200 text-xs font-bold hover:bg-space-800 transition-colors border border-white/10">
              View Audit Logs →
            </a>
          </div>
        </SpatialCard>
      </div>
    </div>
  );
};
