import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck, Key, ArrowRight } from 'lucide-react';
import { SpatialCard } from '../components/common/SpatialCard.js';
import { Input } from '../components/common/Input.js';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      showToast('Session expired due to 5 minutes of inactivity. Please sign in again.', 'warning', 'Session Expired');
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemoCustomer = () => {
    setEmail('customer@bankofmahesh.local');
    setPassword('Customer@12345');
    showToast('Customer account loaded!', 'info');
  };

  const autofillDemoAdmin = () => {
    setEmail('admin@bankofmahesh.local');
    setPassword('Admin@12345');
    showToast('Admin account loaded!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#030509] flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300 cosmic-grid">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Logo Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-950/60 text-space-950 font-black text-2xl border border-emerald-300">
              BM
            </div>
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
            Welcome back to Bank of Mahesh
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Secure portal access to your private banking account.
          </p>
        </div>

        {/* Spatial Card Login Form */}
        <SpatialCard className="p-8 shadow-2xl border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="customer@bankofmahesh.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Instant Quick Credentials Picker */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                Instant Quick Login
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                1-CLICK FILL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={autofillDemoCustomer}
                className="p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-white/10 text-left transition-all hover:border-emerald-500/40 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Customer Account</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">customer@bank...</div>
              </button>

              <button
                type="button"
                onClick={autofillDemoAdmin}
                className="p-3 rounded-xl bg-space-850 hover:bg-space-800 border border-white/10 text-left transition-all hover:border-cyan-500/40 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 group-hover:text-cyan-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Account</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">admin@bankof...</div>
              </button>
            </div>
          </div>
        </SpatialCard>

        {/* Footer Link to Signup */}
        <div className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
            Open an account
          </Link>
        </div>
      </div>
    </div>
  );
};
