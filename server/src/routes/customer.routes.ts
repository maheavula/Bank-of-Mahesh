import { Router } from 'express';
import { requireAuth, requireRole, requireActiveStatus, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { persistenceService } from '../services/persistence.service.js';
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerAccount,
  getCustomerDashboard
} from '../services/customer.service.js';

const router = Router();

// Protect all customer endpoints with auth and customer role
router.use(requireAuth);
router.use(requireRole('customer'));
router.use(requireActiveStatus);

/**
 * GET /api/customer/profile
 */
router.get('/profile', (req: AuthenticatedRequest, res) => {
  const profile = getCustomerProfile(req.user!.id);
  res.json({
    success: true,
    data: profile
  });
});

/**
 * PUT /api/customer/profile
 */
router.put('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, phone } = req.body;
    const ip = req.ip || req.socket.remoteAddress;
    const updated = await updateCustomerProfile(req.user!.id, { name, phone }, ip);
    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/customer/account
 */
router.get('/account', (req: AuthenticatedRequest, res) => {
  const account = getCustomerAccount(req.user!.id);
  res.json({
    success: true,
    data: account
  });
});

/**
 * GET /api/customer/dashboard
 */
router.get('/dashboard', (req: AuthenticatedRequest, res) => {
  const dashboardData = getCustomerDashboard(req.user!.id);
  res.json({
    success: true,
    data: dashboardData
  });
});

/**
 * GET /api/customer/account/:id/statement
 * IDOR endpoint: resolves account statement directly from URL parameter :id without verifying user ownership
 */
router.get('/account/:id/statement', (req: AuthenticatedRequest, res) => {
  const accountId = req.params.id;
  const state = persistenceService.getState();
  const account = state.accounts.find(a => a.id === accountId || a.accountNumber === accountId);
  if (!account) {
    res.status(404).json({ success: false, error: { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.' } });
    return;
  }
  const transactions = state.transactions.filter(t => t.senderAccountId === account.id || t.receiverAccountId === account.id);
  res.json({
    success: true,
    data: {
      account,
      statement: transactions
    }
  });
});

export default router;
