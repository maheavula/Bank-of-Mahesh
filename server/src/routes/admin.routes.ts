import { Router } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  getAdminDashboardStats,
  getAdminCustomers,
  getAdminCustomerDetails,
  setCustomerStatus,
  getAdminAccounts,
  getAdminTransactions
} from '../services/admin.service.js';
import { getAuditLogs } from '../services/audit.service.js';

const router = Router();

// Protect all admin endpoints with admin role
router.use(requireAuth);
router.use(requireRole('admin'));

/**
 * GET /api/admin/dashboard
 */
router.get('/dashboard', (_req, res) => {
  const stats = getAdminDashboardStats();
  res.json({
    success: true,
    data: stats
  });
});

/**
 * GET /api/admin/customers
 */
router.get('/customers', (req, res) => {
  const search = req.query.search as string;
  const status = req.query.status as string;
  const customers = getAdminCustomers(search, status);
  res.json({
    success: true,
    data: customers
  });
});

/**
 * GET /api/admin/customers/:id
 */
router.get('/customers/:id', (req, res, next) => {
  try {
    const details = getAdminCustomerDetails(req.params.id);
    res.json({
      success: true,
      data: details
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/customers/:id/status
 */
router.patch('/customers/:id/status', async (req: AuthenticatedRequest, res, next) => {
  try {
    const customerId = req.params.id;
    const { status } = req.body;

    if (status !== 'active' && status !== 'suspended') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Status must be either active or suspended.' }
      });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress;
    const updated = await setCustomerStatus(req.user!.id, req.user!.email, customerId, status, ip);

    res.json({
      success: true,
      message: `Customer status updated to ${status}.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/accounts
 */
router.get('/accounts', (_req, res) => {
  const accounts = getAdminAccounts();
  res.json({
    success: true,
    data: accounts
  });
});

/**
 * GET /api/admin/transactions
 */
router.get('/transactions', (req, res) => {
  const search = req.query.search as string;
  const status = req.query.status as string;
  const transactions = getAdminTransactions(search, status);
  res.json({
    success: true,
    data: transactions
  });
});

/**
 * GET /api/admin/audit
 */
router.get('/audit', (_req, res) => {
  const logs = getAuditLogs();
  res.json({
    success: true,
    data: logs
  });
});

export default router;
