import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  CreditCard,
  History,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Executive Dashboard', path: '/admin', icon: ShieldAlert },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Accounts Overview', path: '/admin/accounts', icon: CreditCard },
    { label: 'All Transactions', path: '/admin/transactions', icon: History },
    { label: 'Audit Logs', path: '/admin/audit', icon: FileText },
    { label: 'System Health', path: '/admin/system', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-[#030509] flex flex-col md:flex-row text-slate-100 cosmic-grid">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-space-950/90 backdrop-blur-2xl border-r border-cyan-500/20 p-5 min-h-screen">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-white/10 pb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 text-white font-bold font-sans text-xl border border-cyan-400/40">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight font-sans text-white">
              Admin Console
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Bank of Mahesh
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 mb-3 shadow-md">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm border border-cyan-500/40 shrink-0">
              A
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-extrabold text-cyan-200 truncate">{user?.name}</div>
              <div className="text-[11px] text-cyan-400/80 font-mono truncate">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Operations</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-space-950 border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            <Lock className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-cyan-300">Admin Console</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-space-950/95 backdrop-blur-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-lg text-cyan-400">Bank of Mahesh — Admin</div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                        isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Operations</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-space-950/60 border-b border-cyan-500/15">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-bold tracking-wide">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-slate-300">Bank of Mahesh Operations & Risk Audit Console</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs text-emerald-400 font-mono font-bold">SYSTEM ONLINE</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
