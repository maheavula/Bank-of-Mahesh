import React, { useEffect, useState } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { adminApi } from '../../services/api.js';
import { formatDate } from '../../utils/formatters.js';
import { AuditLog } from '../../types/index.js';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs().then((res) => {
      if (res.success && res.data) {
        setLogs(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Audit & Security Logs
        </h1>
        <p className="text-sm text-slate-400">
          Immutable event stream of all administrative and security actions within runtime persistence.
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
                  <th className="px-6 py-4">Audit ID</th>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">{log.id}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{log.userEmail}</td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          log.action === 'TRANSFER'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : log.action === 'ADMIN_STATUS_CHANGE'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : log.action === 'LOGIN' || log.action === 'SIGNUP'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-space-850 text-slate-300 border-white/10'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{formatDate(log.timestamp)}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : 'N/A'}
                    </td>
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
