import React, { useEffect, useState } from 'react';
import { Search, Filter, UserCheck, UserX, Eye, ShieldAlert, CreditCard } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { Button } from '../../components/common/Button.js';
import { Drawer } from '../../components/common/Drawer.js';
import { Modal } from '../../components/common/Modal.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { adminApi } from '../../services/api.js';
import { formatINR, formatDate, maskAccountNumber } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminCustomersPage: React.FC = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Drawer details state
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status Action Modal
  const [statusModalTarget, setStatusModalTarget] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter]);

  const fetchCustomers = async () => {
    try {
      const res = await adminApi.getCustomers({ search, status: statusFilter });
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async (id: string) => {
    setSelectedCustomerId(id);
    setLoadingDetails(true);
    try {
      const res = await adminApi.getCustomerDetails(id);
      if (res.success && res.data) {
        setCustomerDetails(res.data);
      }
    } catch (err) {
      showToast('Failed to fetch customer details.', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusModalTarget) return;

    const newStatus = statusModalTarget.status === 'active' ? 'suspended' : 'active';
    setIsUpdatingStatus(true);

    try {
      const res = await adminApi.updateCustomerStatus(statusModalTarget.id, newStatus);
      if (res.success) {
        showToast(`Customer account set to ${newStatus}.`, 'success');
        setStatusModalTarget(null);
        await fetchCustomers();
        if (selectedCustomerId === statusModalTarget.id) {
          await handleOpenDrawer(statusModalTarget.id);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update customer status.';
      showToast(msg, 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Customer Management
        </h1>
        <p className="text-sm text-slate-400">
          Search, audit, inspect details, and control status for all customer accounts.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, account #, or phone..."
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
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <CardSkeleton />
      ) : (
        <SpatialCard className="p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-950/80 text-slate-400 border-b border-white/10 uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Account Number</th>
                  <th className="px-6 py-4">Account Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{c.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">{c.accountNumber}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{formatINR(c.balance)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDrawer(c.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStatusModalTarget(c)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.status === 'active'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                        title={c.status === 'active' ? 'Suspend Customer' : 'Activate Customer'}
                      >
                        {c.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpatialCard>
      )}

      {/* Customer Details Drawer */}
      <Drawer
        isOpen={!!selectedCustomerId}
        onClose={() => {
          setSelectedCustomerId(null);
          setCustomerDetails(null);
        }}
        title="Customer Profile & Account Details"
      >
        {loadingDetails || !customerDetails ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-space-950 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base">{customerDetails.customer.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{customerDetails.customer.email}</p>
              </div>
              <StatusBadge status={customerDetails.customer.status} />
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">CUSTOMER ID</span>
                <span className="text-slate-100 font-bold">{customerDetails.customer.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">PHONE</span>
                <span className="text-slate-100">{customerDetails.customer.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">ACCOUNT NO</span>
                <span className="text-emerald-400 font-bold">{customerDetails.account?.accountNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">BALANCE</span>
                <span className="text-emerald-400 font-bold">{formatINR(customerDetails.account?.balance || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-500">TOTAL TRANSACTIONS</span>
                <span className="text-slate-100 font-bold">{customerDetails.transactionCount}</span>
              </div>
            </div>

            <Button
              variant={customerDetails.customer.status === 'active' ? 'danger' : 'primary'}
              className="w-full"
              onClick={() => setStatusModalTarget(customerDetails.customer)}
            >
              {customerDetails.customer.status === 'active' ? 'Suspend Account Access' : 'Activate Customer Account'}
            </Button>
          </div>
        )}
      </Drawer>

      {/* Status Confirmation Modal */}
      <Modal
        isOpen={!!statusModalTarget}
        onClose={() => setStatusModalTarget(null)}
        title="Confirm Customer Status Modification"
      >
        {statusModalTarget && (
          <div className="space-y-4 text-slate-200">
            <p className="text-sm">
              Are you sure you want to change the status of <strong>{statusModalTarget.name}</strong> ({statusModalTarget.email}) to{' '}
              <strong className="uppercase">{statusModalTarget.status === 'active' ? 'suspended' : 'active'}</strong>?
            </p>
            {statusModalTarget.status === 'active' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                Warning: Suspended customers will immediately lose access to their active server sessions and will be prohibited from performing transfers or logging in.
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setStatusModalTarget(null)}>
                Cancel
              </Button>
              <Button
                variant={statusModalTarget.status === 'active' ? 'danger' : 'primary'}
                isLoading={isUpdatingStatus}
                onClick={handleToggleStatus}
              >
                Confirm Status Change
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
