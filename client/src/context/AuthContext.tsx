import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../services/api.js';
import { User } from '../types/index.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes idle time

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API failures
    } finally {
      setUser(null);
      localStorage.removeItem('bm_token');
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (user) {
      idleTimerRef.current = setTimeout(async () => {
        showToast('Session expired due to 5 minutes of inactivity.', 'warning', 'Session Expired');
        await logout();
        window.location.href = '/login?expired=1';
      }, IDLE_TIMEOUT_MS);
    }
  }, [user, logout, showToast]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleUserActivity = () => resetIdleTimer();

    events.forEach((evt) => window.addEventListener(evt, handleUserActivity));
    resetIdleTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user, resetIdleTimer]);

  const refreshSession = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('bm_token');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('bm_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('bm_token', res.data.token);
        }
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return res.data.user;
      } else {
        throw new Error(res.error?.message || 'Login failed');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Login failed.';
      showToast(msg, 'error', 'Authentication Failed');
      throw err;
    }
  };

  const signup = async (formData: any): Promise<User> => {
    try {
      const res = await authApi.signup(formData);
      if (res.success && res.data) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('bm_token', res.data.token);
        }
        showToast(`Account created successfully! Welcome to Bank of AMR.`, 'success');
        return res.data.user;
      } else {
        throw new Error(res.error?.message || 'Signup failed');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Registration failed.';
      showToast(msg, 'error', 'Registration Error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout: async () => {
          await logout();
          showToast('You have been signed out.', 'info');
        },
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
