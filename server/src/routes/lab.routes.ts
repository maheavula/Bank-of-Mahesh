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

// Hard: A08 Software and Data Integrity Failures — Unsigned State Restore
router.post('/restore', async (req, res) => {
  try {
    const rawState = req.body;
    if (!rawState || !rawState.users || !rawState.accounts) {
      res.status(400).json({ success: false, error: { message: 'Invalid state payload.' } });
      return;
    }
    // LAB ONLY: unvalidated state import without cryptographic signature verification
    await persistenceService.saveState(rawState);
    res.json({ success: true, message: 'Runtime state restored successfully without signature check.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Hard: A10 Server-Side Request Forgery (SSRF) — Unvalidated Server HTTP Fetch
router.get('/fetch-avatar', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({ success: false, error: { message: 'URL query parameter is required.' } });
    return;
  }
  try {
    // LAB ONLY: unvalidated SSRF fetch allowing internal IP access (127.0.0.1 / localhost)
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const bodyText = await response.text();
    res.type(contentType).send(bodyText);
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: `SSRF Fetch Failed: ${err.message}` } });
  }
});

export default router;
