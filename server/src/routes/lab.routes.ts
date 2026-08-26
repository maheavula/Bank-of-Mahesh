import { Router } from 'express';
import { persistenceService } from '../services/persistence.service.js';

/** Deliberately vulnerable CTF endpoints. Never deploy outside an isolated lab. */
const router = Router();

// Easy: reflected XSS — untrusted query data is injected into HTML.
router.get('/reflect', (req, res) => {
  const message = String(req.query.message || 'Bank of AMR training reflection');
  res.type('html').send(`<main><h1>Bank of AMR Reflection</h1><p>${message}</p></main>`);
});

// Medium: sensitive-data exposure — unauthenticated full runtime export.
router.get('/export', (_req, res) => {
  res.json({ success: true, data: persistenceService.getState(), labOnly: true });
});

// Easy: deliberately trigger the verbose global error handler.
router.get('/debug/error', () => {
  throw new Error('Intentional Bank of AMR lab error: inspect the verbose response.');
});

export default router;
