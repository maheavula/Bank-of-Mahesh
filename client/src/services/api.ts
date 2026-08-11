import axios from 'axios';
import { ApiResponse, User, Account, Transaction, AuditLog } from '../types/index.js';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach stored session token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to catch 401 Unauthorized / Session Expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bm_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// API Group 1 — Auth
export const authApi = {
  signup: async (data: any) => {
    const res = await API.post<ApiResponse>('/auth/signup', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await API.post<ApiResponse>('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await API.post<ApiResponse>('/auth/logout');
    return res.data;
  },
  me: async () => {
    const res = await API.get<ApiResponse>('/auth/me');
    return res.data;
  }
};

// API Group 2 — Customer
export const customerApi = {
  getProfile: async () => {
    const res = await API.get<ApiResponse<User>>('/customer/profile');
    return res.data;
  },
  updateProfile: async (data: { name?: string; phone?: string }) => {
    const res = await API.put<ApiResponse<User>>('/customer/profile', data);
    return res.data;
  },
  getAccount: async () => {
    const res = await API.get<ApiResponse<Account>>('/customer/account');
    return res.data;
  },
  getDashboard: async () => {
    const res = await API.get<ApiResponse>('/customer/dashboard');
    return res.data;
  }
};

// API Group 3 — Transactions
export const transactionApi = {
  getTransactions: async (params?: { type?: string; search?: string }) => {
    const res = await API.get<ApiResponse<Transaction[]>>('/transactions', { params });
    return res.data;
  },
  getTransactionById: async (id: string) => {
    const res = await API.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return res.data;
  },
  transfer: async (data: { recipientAccountNumber: string; amount: number; description?: string }) => {
    const res = await API.post<ApiResponse>('/transactions/transfer', data);
    return res.data;
  }
};

// API Group 4 — Admin
export const adminApi = {
  getDashboard: async () => {
    const res = await API.get<ApiResponse>('/admin/dashboard');
    return res.data;
  },
  getCustomers: async (params?: { search?: string; status?: string }) => {
    const res = await API.get<ApiResponse<any[]>>('/admin/customers', { params });
    return res.data;
  },
  getCustomerDetails: async (id: string) => {
    const res = await API.get<ApiResponse>(`/admin/customers/${id}`);
    return res.data;
  },
  updateCustomerStatus: async (id: string, status: 'active' | 'suspended') => {
    const res = await API.patch<ApiResponse>(`/admin/customers/${id}/status`, { status });
    return res.data;
  },
  getAccounts: async () => {
    const res = await API.get<ApiResponse<Account[]>>('/admin/accounts');
    return res.data;
  },
  getTransactions: async (params?: { search?: string; status?: string }) => {
    const res = await API.get<ApiResponse<Transaction[]>>('/admin/transactions', { params });
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await API.get<ApiResponse<AuditLog[]>>('/admin/audit');
    return res.data;
  }
};

// API Group 5 — Session
export const sessionApi = {
  getSession: async () => {
    const res = await API.get<ApiResponse>('/session');
    return res.data;
  },
  refreshSession: async () => {
    const res = await API.post<ApiResponse>('/session/refresh');
    return res.data;
  }
};

// API Group 6 — System
export const systemApi = {
  getHealth: async () => {
    const res = await API.get<ApiResponse>('/system/health');
    return res.data;
  },
  getInfo: async () => {
    const res = await API.get<ApiResponse>('/system/info');
    return res.data;
  }
};

export default API;
