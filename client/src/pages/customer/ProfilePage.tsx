import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save, CheckCircle2 } from 'lucide-react';
import { SpatialCard } from '../../components/common/SpatialCard.js';
import { Input } from '../../components/common/Input.js';
import { Button } from '../../components/common/Button.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { customerApi } from '../../services/api.js';
import { formatDate } from '../../utils/formatters.js';
import { User as UserType } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const ProfilePage: React.FC = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await customerApi.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setName(res.data.name);
        setPhone(res.data.phone);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await customerApi.updateProfile({ name, phone });
      if (res.success && res.data) {
        setProfile(res.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update profile.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Customer Profile
        </h1>
        <p className="text-sm text-slate-400">
          Manage your personal details and view account identity parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <SpatialCard className="p-6 text-center space-y-4 md:col-span-1">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-3xl mx-auto">
            {profile.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">{profile.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.id}</p>
          </div>

          <StatusBadge status={profile.status} />

          <div className="pt-4 border-t border-white/10 text-xs text-left space-y-2 text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>ROLE:</span>
              <span className="text-slate-200 capitalize font-bold">{profile.role}</span>
            </div>
            <div className="flex justify-between">
              <span>CREATED:</span>
              <span className="text-slate-300">{formatDate(profile.createdAt)}</span>
            </div>
            {profile.lastLoginAt && (
              <div className="flex justify-between">
                <span>LAST LOGIN:</span>
                <span className="text-slate-300">{formatDate(profile.lastLoginAt)}</span>
              </div>
            )}
          </div>
        </SpatialCard>

        {/* Edit Form */}
        <SpatialCard className="p-6 md:col-span-2">
          <h2 className="text-base font-bold text-slate-100 mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Update Account Details
          </h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">Primary Email Address</label>
              <div className="p-3 rounded-xl bg-space-950 border border-white/5 text-slate-400 text-sm flex items-center gap-3 font-mono">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
                <span className="ml-auto text-[10px] text-slate-500 uppercase">Primary</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Email modifications require administrative verification.</p>
            </div>

            <Button
              type="submit"
              size="md"
              className="mt-4"
              isLoading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </form>
        </SpatialCard>
      </div>
    </div>
  );
};
