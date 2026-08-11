import React from 'react';
import { Shield, Key, Lock, CheckCircle2 } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { Input } from '../../components/common/Input.js';
import { Button } from '../../components/common/Button.js';
import { useToast } from '../../context/ToastContext.js';

export const SecurityPage: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Security Center
        </h1>
        <p className="text-sm text-slate-400">
          Manage your security parameters, encryption standards, and credential controls.
        </p>
      </div>

      {/* Security Status Card */}
      <SpatialCard glow="emerald" className="p-6 border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              Account Protection Active
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROTECTED
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5-minute idle session timeout policy is active. Inactive sessions automatically expire for your security.
            </p>
          </div>
        </div>
      </SpatialCard>

      {/* Password Management */}
      <SpatialCard className="p-6">
        <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          Simulated Credential Rotation
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Bank of Mahesh employs server-side bcrypt password hashing. All credential updates immediately invalidate existing sessions across unauthorized devices.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast('Simulated password updated successfully!', 'success');
          }}
          className="space-y-4 max-w-md"
        >
          <Input label="Current Password" type="password" placeholder="••••••••••••" required />
          <Input label="New Password" type="password" placeholder="At least 6 characters" required />
          <Input label="Confirm New Password" type="password" placeholder="Repeat new password" required />
          <Button type="submit" size="md">
            Update Credential
          </Button>
        </form>
      </SpatialCard>
    </div>
  );
};
