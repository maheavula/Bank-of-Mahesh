import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Send, History, Copy, Check, ShieldCheck, Building2, Calendar, Lock, Sparkles, Wallet } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { Button } from '../../components/common/Button.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { customerApi } from '../../services/api.js';
import { formatINR, formatDate } from '../../utils/formatters.js';
import { Account } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AccountPage: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const res = await customerApi.getAccount();
      if (res.success && res.data) {
        setAccount(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyAccountNumber = () => {
    if (account) {
      navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      showToast('Account number copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <CardSkeleton />;
  if (!account) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
          My Account Specification
        </h1>
        <p className="text-sm text-slate-400">
          Official details and liquidity parameters of your Bank of Mahesh account.
        </p>
      </div>

      {/* Account Visual Card */}
      <div className="metal-card rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15 relative z-10">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4" />
              {account.accountType} VIP Reserve
            </div>
            <div className="flex items-center gap-3 text-2xl md:text-3xl font-mono font-extrabold text-white tracking-wider">
              <span>{account.accountNumber}</span>
              <button
                onClick={copyAccountNumber}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                title="Copy Account Number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <StatusBadge status={account.status} />
        </div>

        {/* Balance & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 relative z-10">
          <div>
            <span className="text-xs text-slate-300 block mb-1 uppercase font-mono">Available Balance</span>
            <span className="text-2xl md:text-4xl font-extrabold text-white font-mono drop-shadow">
              {formatINR(account.balance)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-300 block mb-1 uppercase font-mono">Currency Standard</span>
            <span className="text-lg font-bold text-slate-100">{account.currency} (Indian Rupee)</span>
          </div>

          <div>
            <span className="text-xs text-slate-300 block mb-1 uppercase font-mono">Creation Date</span>
            <span className="text-sm font-semibold text-slate-200">{formatDate(account.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/app/transfer">
          <SpatialCard hoverable glow="emerald" className="p-6 flex items-center gap-4 border-emerald-500/30">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 shadow-lg shadow-emerald-950/50">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Send Money</h3>
              <p className="text-xs text-slate-400 mt-0.5">Transfer funds instantly to any BM account number.</p>
            </div>
          </SpatialCard>
        </Link>

        <Link to="/app/transactions">
          <SpatialCard hoverable glow="cyan" className="p-6 flex items-center gap-4 border-cyan-500/30">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0 shadow-lg shadow-cyan-950/50">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Ledger Statement</h3>
              <p className="text-xs text-slate-400 mt-0.5">Review all debited and credited transaction records.</p>
            </div>
          </SpatialCard>
        </Link>
      </div>
    </div>
  );
};
