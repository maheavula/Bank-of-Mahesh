import { Router } from 'express';
import { persistenceService } from '../services/persistence.service.js';

const router = Router();

/**
 * GET /api/system/health
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'online',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /api/system/info
 */
router.get('/info', (_req, res) => {
  const state = persistenceService.getState();

  res.json({
    success: true,
    data: {
      application: 'Bank of AMR',
      subtitle: 'Intentionally Insecure Local Cybersecurity Training Lab',
      mode: 'local-training-lab',
      version: state.metadata.version || '1.0.0',
      lastDataSave: state.metadata.lastSavedAt,
      notice: 'This is a self-contained banking simulator for demonstration purposes. No real bank accounts or financial transactions are involved.'
    }
  });
});

export default router;
