import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { persistenceService } from '../services/persistence.service.js';

describe('API Group 1 — Authentication (/api/auth)', () => {
  beforeAll(async () => {
    await persistenceService.init();
  });

  it('should login demo customer with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofamr.local',
        password: 'AmrCust#2026!Kumar'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('customer@bankofamr.local');
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofamr.local',
        password: 'WrongPassword123'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('PASSWORD_INCORRECT');
  });

  it('should register a new customer account', async () => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Customer',
        email: testEmail,
        phone: '+91 9999988888',
        password: 'TestPassword@123',
        confirmPassword: 'TestPassword@123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.account.accountNumber).toMatch(/^BA\d+/);
    expect(res.body.data.account.balance).toBe(1000000); // Starting welcome bonus ₹10,000.00
  });

  it('should reset password successfully and allow login with new password', async () => {
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: 'customer@bankofamr.local',
        newPassword: 'new-secret-pass-123',
        confirmPassword: 'new-secret-pass-123'
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofamr.local',
        password: 'new-secret-pass-123'
      });

    expect(loginRes.status).toBe(200);

    // Revert password back
    await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: 'customer@bankofamr.local',
        newPassword: 'AmrCust#2026!Kumar',
        confirmPassword: 'AmrCust#2026!Kumar'
      });
  });

  it('should prevent duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Duplicate AMR',
        email: 'customer@bankofamr.local',
        phone: '+91 9812345678',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });
});
