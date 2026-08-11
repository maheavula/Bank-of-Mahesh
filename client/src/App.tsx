import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout.js';
import { AdminLayout } from './components/layout/AdminLayout.js';

// Public Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { SignupPage } from './pages/SignupPage.js';

// Customer Pages
import { DashboardPage } from './pages/customer/DashboardPage.js';
import { AccountPage } from './pages/customer/AccountPage.js';
import { TransferPage } from './pages/customer/TransferPage.js';
import { TransactionsPage } from './pages/customer/TransactionsPage.js';
import { ProfilePage } from './pages/customer/ProfilePage.js';
import { SecurityPage } from './pages/customer/SecurityPage.js';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage.js';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage.js';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage.js';
import { AdminAuditPage } from './pages/admin/AdminAuditPage.js';
import { AdminSystemPage } from './pages/admin/AdminSystemPage.js';

const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#06080F]" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#07090E]" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/app" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Customer Portal */}
            <Route
              path="/app"
              element={
                <CustomerRoute>
                  <CustomerLayout />
                </CustomerRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="transfer" element={<TransferPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>

            {/* Admin Console */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
              <Route path="system" element={<AdminSystemPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
