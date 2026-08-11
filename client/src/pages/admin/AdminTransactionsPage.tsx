import React, { useEffect, useState } from 'react';
import { Search, Filter, History, Eye } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { Drawer } from '../../components/common/Drawer.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { adminApi } from '../../services/api.js';
import { formatINR, formatDate, maskAccountNumber } from '../../utils/formatters.js';
import { Transaction } from '../../types/index.js';

export const AdminTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTxns();
  }, [search, statusFilter]);

  const fetchTxns = async () => {
    try {
      const res = await adminApi.getTransactions({ search, status: statusFilter });
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Systemic Transactions Audit
        </h1>
        <p className="text-sm text-slate-400">
          Complete ledger of all money movement across Bank of Mahesh simulator accounts.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by transaction ID, sender, recipient, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-white/10 rounded-xl text-sm py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-space-900 border border-white/10 rounded-xl text-sm py-2.5 px-4 text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <CardSkeleton />
      ) : (
        <SpatialCard className="p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4">TXN ID</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Amount (INR)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-300">{t.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{t.senderName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{maskAccountNumber(t.senderAccountId)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{t.receiverName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{maskAccountNumber(t.receiverAccountId)}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{formatINR(t.amount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(t.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpatialCard>
      )}

      {/* Transaction Detail Drawer */}
      <Drawer isOpen={!!selectedTxn} onClose={() => setSelectedTxn(null)} title="Transaction Record Audit">
        {selectedTxn && (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-2xl bg-space-950 border border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">TRANSACTION VALUE</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {formatINR(selectedTxn.amount)}
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mt-3 inline-block border border-emerald-500/20">
                {selectedTxn.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">TRANSACTION ID</span>
                <span className="text-cyan-300 font-bold">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">SENDER ACCOUNT</span>
                <span className="text-slate-100">{selectedTxn.senderName} ({selectedTxn.senderAccountId})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">RECIPIENT ACCOUNT</span>
                <span className="text-slate-100">{selectedTxn.receiverName} ({selectedTxn.receiverAccountId})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">DESCRIPTION</span>
                <span className="text-slate-300">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">TIMESTAMP</span>
                <span className="text-slate-300">{formatDate(selectedTxn.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
