import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Shield, CheckCircle2 } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { CardSkeleton } from '../../components/common/Skeleton.js';
import { systemApi } from '../../services/api.js';
import { formatDate } from '../../utils/formatters.js';

export const AdminSystemPage: React.FC = () => {
  const [health, setHealth] = useState<any | null>(null);
  const [info, setInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([systemApi.getHealth(), systemApi.getInfo()]).then(([healthRes, infoRes]) => {
      if (healthRes.success) setHealth(healthRes.data);
      if (infoRes.success) setInfo(infoRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
          System Health & Environment Status
        </h1>
        <p className="text-sm text-slate-400">
          Runtime environment parameters, process uptime, and system metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health Card */}
        <SpatialCard glow="cyan" className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Server Health</h3>
              <p className="text-xs text-slate-400">System Probe Status</p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">SERVICE STATUS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ONLINE
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">PROCESS UPTIME</span>
              <span className="text-slate-200">{health?.uptimeSeconds || 0} seconds</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">SERVER TIMESTAMP</span>
              <span className="text-slate-300">{formatDate(health?.timestamp)}</span>
            </div>
          </div>
        </SpatialCard>

        {/* Metadata Card */}
        <SpatialCard className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">System Metadata</h3>
              <p className="text-xs text-slate-400">Persistence Configuration</p>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">APPLICATION</span>
              <span className="text-slate-100 font-bold">{info?.application}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">IDLE SAFEGUARD</span>
              <span className="text-cyan-300 font-bold uppercase">5-Min Idle Guard</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">VERSION</span>
              <span className="text-slate-200">v{info?.version}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-space-950 border border-white/5">
              <span className="text-slate-400">LAST PERSISTED AT</span>
              <span className="text-slate-300">{info?.lastDataSave}</span>
            </div>
          </div>
        </SpatialCard>
      </div>
    </div>
  );
};
