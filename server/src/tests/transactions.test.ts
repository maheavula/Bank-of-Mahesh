import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { persistenceService } from '../services/persistence.service.js';

describe('API Group 3 — Transactions & Transfer Simulation (/api/transactions)', () => {
  let customerCookie: string;

  beforeAll(async () => {
    await persistenceService.init();

    // Login as AMR Kumar
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofamr.local',
        password: 'AmrCust#2026!Kumar'
      });

    customerCookie = loginRes.headers['set-cookie'][0];
  });

  it('should process a valid transfer from AMR to Priya', async () => {
    const res = await request(app)
      .post('/api/transactions/transfer')
      .set('Cookie', customerCookie)
      .send({
        recipientAccountNumber: 'BA8823948210', // Priya's account
        amount: 500, // ₹500.00
        description: 'Test transfer for verification'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transaction.id).toMatch(/^TXN-/);
    expect(res.body.data.transaction.amount).toBe(50000); // 50000 paise = ₹500.00
  });

  it('should reject transfer with insufficient balance', async () => {
    const res = await request(app)
      .post('/api/transactions/transfer')
      .set('Cookie', customerCookie)
      .send({
        recipientAccountNumber: 'BA8823948210',
        amount: 999999999, // Extremely large amount
        description: 'Excessive amount'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INSUFFICIENT_BALANCE');
  });

  it('should reject transfer to oneself', async () => {
    const res = await request(app)
      .post('/api/transactions/transfer')
      .set('Cookie', customerCookie)
      .send({
        recipientAccountNumber: 'BA7089123456', // AMR's own account
        amount: 100,
        description: 'Self transfer'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SELF_TRANSFER_NOT_ALLOWED');
  });

  it('should reject transfer to invalid non-existent recipient', async () => {
    const res = await request(app)
      .post('/api/transactions/transfer')
      .set('Cookie', customerCookie)
      .send({
        recipientAccountNumber: 'BA0000000000',
        amount: 100,
        description: 'Invalid recipient test'
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RECIPIENT_NOT_FOUND');
  });
});
