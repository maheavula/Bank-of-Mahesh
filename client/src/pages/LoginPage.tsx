import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, X, KeyRound } from 'lucide-react';
import { SpatialCard } from '../components/common/SpatialCard.js';
import { Input } from '../components/common/Input.js';
import { Button } from '../components/common/Button.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { authApi } from '../services/api.js';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset password state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !newPassword || !confirmPassword) {
      showToast('Please fill in all required reset fields.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setIsResetLoading(true);
    try {
      const res = await authApi.resetPassword({
        email: resetEmail,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        showToast(res.message || 'Password reset successfully!', 'success', 'Password Updated');
        setEmail(resetEmail);
        setIsResetModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.error?.message || 'Failed to reset password.', 'error');
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err?.message || 'Failed to reset password.';
      showToast(errMsg, 'error');
    } finally {
      setIsResetLoading(false);
    }
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
            Welcome back to Bank of AMR
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
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setIsResetModalOpen(true);
                  }}
                  className="text-xs text-emerald-400 font-medium hover:text-emerald-300 hover:underline focus:outline-none transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
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
        </SpatialCard>

        {/* Footer Link to Signup */}
        <div className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
            Open an account
          </Link>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full relative">
            <SpatialCard className="p-6 md:p-8 shadow-2xl border-emerald-500/30 relative">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Reset Your Password</h2>
                <p className="text-xs text-slate-400">
                  Enter your registered email address and choose a new password.
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="New Password"
                  type={showResetPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="focus:outline-none hover:text-slate-200 transition-colors"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />

                <Input
                  label="Confirm New Password"
                  type={showResetPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="w-1/2"
                    onClick={() => setIsResetModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="md"
                    className="w-1/2"
                    isLoading={isResetLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </SpatialCard>
          </div>
        </div>
      )}
    </div>
  );
};

