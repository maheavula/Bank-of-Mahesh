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
        email: 'customer@bankofmahesh.local',
        password: 'Customer@12345'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('customer@bankofmahesh.local');
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofmahesh.local',
        password: 'WrongPassword123'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
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
    expect(res.body.data.account.accountNumber).toMatch(/^BM\d+/);
    expect(res.body.data.account.balance).toBe(1000000); // Starting welcome bonus ₹10,000.00
  });

  it('should prevent duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Duplicate Mahesh',
        email: 'customer@bankofmahesh.local',
        phone: '+91 9812345678',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });
});
