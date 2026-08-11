import { Router } from 'express';
import { requireAuth, requireActiveStatus, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { getCustomerTransactions, getTransactionById, processTransfer } from '../services/transaction.service.js';
import { inrToPaise } from '../utils/money.js';

const router = Router();

router.use(requireAuth);
router.use(requireActiveStatus);

/**
 * GET /api/transactions
 */
router.get('/', (req: AuthenticatedRequest, res) => {
  const filterType = req.query.type as string;
  const search = req.query.search as string;
  const transactions = getCustomerTransactions(req.user!.id, filterType, search);

  res.json({
    success: true,
    data: transactions
  });
});

/**
 * GET /api/transactions/:id
 */
router.get('/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const txnId = req.params.id;
    const isAdmin = req.user!.role === 'admin';
    const txn = getTransactionById(txnId, req.user!.id, isAdmin);

    res.json({
      success: true,
      data: txn
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/transactions/transfer
 */
router.post('/transfer', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { recipientAccountNumber, amount, description } = req.body;

    if (!recipientAccountNumber) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_RECIPIENT', message: 'Recipient account number is required.' }
      });
      return;
    }

    // Convert amount in INR to integer paise
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Transfer amount must be a positive number.' }
      });
      return;
    }

    const amountPaise = inrToPaise(numericAmount);
    const ip = req.ip || req.socket.remoteAddress;

    const result = await processTransfer(
      {
        senderUserId: req.user!.id,
        recipientAccountNumber,
        amountPaise,
        description
      },
      ip
    );

    res.status(201).json({
      success: true,
      message: 'Transfer processed successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;
