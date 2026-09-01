import React, { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, History, FileText } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { Drawer } from '../../components/common/Drawer.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { customerApi, transactionApi } from '../../services/api.js';
import { formatINR, formatDate, maskAccountNumber } from '../../utils/formatters.js';
import { Transaction, Account } from '../../types/index.js';

export const TransactionsPage: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Read search query param from URL if passed from header search
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    customerApi.getAccount().then((res) => {
      if (res.success && res.data) setAccount(res.data);
    });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filterType, search]);

  const fetchTransactions = async () => {
    try {
      const res = await transactionApi.getTransactions({ type: filterType, search });
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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
          Transaction Statement Ledger
        </h1>
        <p className="text-sm text-slate-400">
          Complete statement of all debits, credits, and money transfers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID, recipient, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-white/10 rounded-xl text-sm py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-space-900 border border-white/10 rounded-xl text-sm py-2.5 px-4 text-slate-200 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Transactions</option>
            <option value="incoming">Incoming Only</option>
            <option value="outgoing">Outgoing Only</option>
          </select>
        </div>
      </div>

      {search && (
        <div className="p-3 bg-space-900 border border-white/10 rounded-xl text-xs text-slate-300">
          Search result feedback for: <span dangerouslySetInnerHTML={{ __html: search }} />
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <CardSkeleton />
      ) : transactions.length === 0 ? (
        <SpatialCard className="text-center py-12 text-slate-400">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium">No matching transactions found</p>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search query or filter settings.</p>
        </SpatialCard>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn) => {
            const isOutgoing = account ? txn.senderAccountId === account.id : false;
            return (
              <SpatialCard
                key={txn.id}
                hoverable
                onClick={() => setSelectedTxn(txn)}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
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
                  <div className={`text-base font-bold font-mono ${isOutgoing ? 'text-rose-400' : 'text-emerald-400'}`}>
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

      {/* Transaction Detail Drawer */}
      <Drawer
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Record Audit"
      >
        {selectedTxn && (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-2xl bg-space-950 border border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">SETTLED VALUE</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {formatINR(selectedTxn.amount)}
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mt-3 inline-block border border-emerald-500/20 uppercase">
                {selectedTxn.status}
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">TRANSACTION ID</span>
                <span className="text-white font-bold">{selectedTxn.id}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">SENDER</span>
                <span className="text-slate-100">{selectedTxn.senderName} ({maskAccountNumber(selectedTxn.senderAccountId)})</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">RECIPIENT</span>
                <span className="text-slate-100">{selectedTxn.receiverName} ({maskAccountNumber(selectedTxn.receiverAccountId)})</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">CURRENCY</span>
                <span className="text-slate-100">{selectedTxn.currency}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">DATE & TIME</span>
                <span className="text-slate-100">{formatDate(selectedTxn.createdAt)}</span>
              </div>

              {selectedTxn.description && (
                <div className="py-2">
                  <span className="text-slate-500 block mb-1">MEMO</span>
                  {/* LAB ONLY: saved transfer descriptions are rendered as HTML (stored XSS). */}
                  <p
                    className="text-slate-200 italic font-sans text-sm bg-space-950 p-3 rounded-xl border border-white/5"
                    dangerouslySetInnerHTML={{ __html: selectedTxn.description }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
