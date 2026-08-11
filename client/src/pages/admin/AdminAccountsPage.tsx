import React, { useEffect, useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { adminApi } from '../../services/api.js';
import { formatINR, formatDate } from '../../utils/formatters.js';

export const AdminAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAccounts().then((res) => {
      if (res.success && res.data) {
        setAccounts(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Accounts Registry
        </h1>
        <p className="text-sm text-slate-400">
          Global overview of all simulated deposit accounts and balances.
        </p>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <SpatialCard className="p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4">Account Number</th>
                  <th className="px-6 py-4">Owner Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Currency</th>
                  <th className="px-6 py-4">Account Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">{acc.accountNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-100">
                      <div>{acc.ownerName}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{acc.ownerEmail}</div>
                    </td>
                    <td className="px-6 py-4">{acc.accountType}</td>
                    <td className="px-6 py-4 font-mono">{acc.currency}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{formatINR(acc.balance)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={acc.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(acc.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpatialCard>
      )}
    </div>
  );
};
