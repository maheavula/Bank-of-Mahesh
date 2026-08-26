import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, CheckCircle2, ArrowRight, Wallet, ShieldAlert, FileText, Check } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { Input } from '../../components/common/Input.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { customerApi, transactionApi } from '../../services/api.js';
import { formatINR, formatDate, maskAccountNumber } from '../../utils/formatters.js';
import { Account, Transaction } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const TransferPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [account, setAccount] = useState<Account | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Success State Receipt
  const [completedTxn, setCompletedTxn] = useState<{
    transaction: Transaction;
    newBalance: number;
  } | null>(null);

  useEffect(() => {
    customerApi.getAccount().then((res) => {
      if (res.success && res.data) setAccount(res.data);
    });
  }, []);

  const handleReviewTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient.trim()) {
      showToast('Please enter recipient account number.', 'error');
      return;
    }

    const numAmount = parseFloat(amountStr);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid transfer amount greater than 0.', 'error');
      return;
    }

    if (account) {
      const amountPaise = Math.round(numAmount * 100);
      if (amountPaise > account.balance) {
        showToast('Insufficient available balance for this transfer.', 'error');
        return;
      }
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmTransfer = async () => {
    setIsLoading(true);
    try {
      const res = await transactionApi.transfer({
        recipientAccountNumber: recipient.trim(),
        amount: parseFloat(amountStr),
        description: description.trim() || undefined
      });

      if (res.success && res.data) {
        setCompletedTxn(res.data);
        setIsConfirmModalOpen(false);
        showToast('Money transfer processed successfully!', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Transfer failed.';
      showToast(msg, 'error', 'Transaction Error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCompletedTxn(null);
    setRecipient('');
    setAmountStr('');
    setDescription('');
    customerApi.getAccount().then((res) => {
      if (res.success && res.data) setAccount(res.data);
    });
  };

  if (completedTxn) {
    const { transaction, newBalance } = completedTxn;
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-scale-up py-6">
        <SpatialCard glow="emerald" className="p-8 text-center bg-gradient-to-b from-space-900 via-space-850 to-emerald-950/40 border-emerald-500/40 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            Transfer Settled & Completed
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-mono mt-4 drop-shadow">
            {formatINR(transaction.amount)}
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            Transferred to <strong className="text-white">{transaction.receiverName}</strong> ({maskAccountNumber(transaction.receiverAccountId)})
          </p>

          <div className="bg-space-950/90 rounded-2xl p-5 my-6 text-left space-y-2.5 border border-white/10 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">TRANSACTION ID</span>
              <span className="text-emerald-400 font-bold">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TIMESTAMP</span>
              <span className="text-slate-200">{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">UPDATED BALANCE</span>
              <span className="text-white font-bold">{formatINR(newBalance)}</span>
            </div>
            {transaction.description && (
              <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                <span className="text-slate-400">MEMO</span>
                <span className="text-slate-200 italic">{transaction.description}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button variant="secondary" size="md" className="w-full" onClick={resetForm}>
              Make Another Transfer
            </Button>
            <Link to="/app" className="w-full">
              <Button size="md" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </SpatialCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
          Instant Transfer Money
        </h1>
        <p className="text-sm text-slate-400">
          Transfer funds instantly to any Bank of AMR account holder.
        </p>
      </div>

      {/* Available Balance Box */}
      {account && (
        <SpatialCard glow="emerald" className="p-5 flex items-center justify-between bg-emerald-950/20 border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Sender Account ({maskAccountNumber(account.accountNumber)})</span>
              <span className="text-sm font-bold text-white">{account.accountType} Account</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Available Liquidity</span>
            <span className="text-xl font-bold text-emerald-400 font-mono drop-shadow">{formatINR(account.balance)}</span>
          </div>
        </SpatialCard>
      )}

      {/* Transfer Form */}
      <SpatialCard className="p-8">
        <form onSubmit={handleReviewTransfer} className="space-y-6">
          <Input
            label="Recipient Account Number"
            type="text"
            placeholder="e.g. BM8823948210"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            helperText="Enter recipient Bank of AMR account number."
            required
          />

          <Input
            label="Transfer Amount (INR ₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            helperText="Amount will be transferred in Indian Rupees."
            required
          />

          <Input
            label="Transfer Description (Optional)"
            type="text"
            placeholder="e.g. Monthly rent, Project fee"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" size="lg" className="w-full shadow-xl shadow-emerald-950/60" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Review Transfer Details
          </Button>
        </form>
      </SpatialCard>

      {/* Transfer Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Money Transfer"
      >
        <div className="space-y-6 text-slate-200">
          <div className="p-4 rounded-xl bg-space-950 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient Account:</span>
              <span className="text-white font-bold">{recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transfer Amount:</span>
              <span className="text-emerald-400 font-bold text-lg">
                {formatINR(Math.round(parseFloat(amountStr || '0') * 100))}
              </span>
            </div>
            {description && (
              <div className="flex justify-between border-t border-white/5 pt-2">
                <span className="text-slate-400">Description:</span>
                <span className="text-slate-200 italic">{description}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Are you sure you want to proceed with this transfer? The specified amount will be debited immediately.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" className="w-full" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full shadow-lg shadow-emerald-950/50" isLoading={isLoading} onClick={handleConfirmTransfer}>
              Confirm & Authorize
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
