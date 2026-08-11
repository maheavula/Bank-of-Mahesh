import React from 'react';

export type StatusType = 'active' | 'suspended' | 'frozen' | 'completed' | 'pending' | 'failed' | 'admin' | 'customer';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotClass = 'bg-slate-400';

  if (s === 'active' || s === 'completed') {
    colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    dotClass = 'bg-emerald-400';
  } else if (s === 'suspended' || s === 'failed' || s === 'frozen') {
    colorClasses = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    dotClass = 'bg-rose-400';
  } else if (s === 'pending') {
    colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    dotClass = 'bg-amber-400';
  } else if (s === 'admin') {
    colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    dotClass = 'bg-cyan-400';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${padding} ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
