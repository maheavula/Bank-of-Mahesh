import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Send,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Topbar Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Top-Screen Notification Modal State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Security Shield Active',
      message: 'Your account is protected with automatic 5-minute idle session termination.',
      time: 'Just now',
      unread: true,
      icon: Shield
    },
    {
      id: '2',
      title: 'Welcome to Bank of Mahesh',
      message: 'Your VIP Reserve Savings Account is active and ready for instant transfers.',
      time: 'Today',
      unread: true,
      icon: Sparkles
    },
    {
      id: '3',
      title: 'Account Statement Ready',
      message: 'Your real-time transaction ledger statement is up to date.',
      time: 'Yesterday',
      unread: true,
      icon: CheckCircle2
    }
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearNotifications = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const navItems = [
    { label: 'Overview', path: '/app', icon: LayoutDashboard },
    { label: 'My Account', path: '/app/account', icon: CreditCard },
    { label: 'Transactions', path: '/app/transactions', icon: History },
    { label: 'Transfer Money', path: '/app/transfer', icon: Send },
    { label: 'Profile', path: '/app/profile', icon: User },
    { label: 'Security', path: '/app/security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#030509] flex flex-col md:flex-row text-slate-100 relative">
      {/* Top-Screen Notification Backdrop & Modal */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center p-4 pt-6 md:pt-10 animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Top-Screen Floating Panel */}
          <div className="relative w-full max-w-lg bg-space-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 animate-scale-up space-y-4 p-6 glow-emerald">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-sans">Account Notifications</h3>
                  <p className="text-[11px] text-slate-400">Bank of Mahesh Security & System Alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-xs font-semibold text-emerald-400 hover:underline bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20"
                  >
                    Clear Unread ({unreadCount})
                  </button>
                )}
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      n.unread
                        ? 'bg-space-850 border-emerald-500/40 text-slate-100 shadow-md shadow-emerald-950/20'
                        : 'bg-space-950/60 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-100 text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        {n.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-normal">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-6">{n.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-space-900/80 backdrop-blur-xl border-r border-white/10 p-5 min-h-screen">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/50 text-white font-bold font-sans text-xl border border-emerald-400/40">
            BM
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight font-sans bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              Bank of Mahesh
            </div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              VIP Reserve
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
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-space-850/90 border border-emerald-500/30 mb-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-black text-base shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-extrabold text-white truncate drop-shadow-sm">{user?.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-space-900 border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            BM
          </div>
          <span className="font-bold text-sm text-white">{user?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slideout Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-space-950/95 backdrop-blur-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-lg text-emerald-400">Bank of Mahesh</div>
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
                    end={item.path === '/app'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300'
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
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-space-900/40 backdrop-blur-md border-b border-white/5 relative">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-semibold tracking-wide">
              VIP PORTAL
            </span>
            <span className="text-slate-300">Bank of Mahesh — Private Banking Terminal</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Functional Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-space-950/80 border border-white/10 rounded-xl text-xs py-2 pl-9 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
              />
            </form>

            {/* Notification Bell Button */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors relative"
              title="Open Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-space-900 animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Page Router Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
