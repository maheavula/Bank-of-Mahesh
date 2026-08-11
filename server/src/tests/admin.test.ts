import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { persistenceService } from '../services/persistence.service.js';

describe('API Group 4 — Admin & Role-Based Access Control (/api/admin)', () => {
  let customerCookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    await persistenceService.init();

    // Login customer
    const custRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@bankofmahesh.local',
        password: 'Customer@12345'
      });
    customerCookie = custRes.headers['set-cookie'][0];

    // Login admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@bankofmahesh.local',
        password: 'Admin@12345'
      });
    adminCookie = adminRes.headers['set-cookie'][0];
  });

  it('should block customer from accessing admin dashboard', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Cookie', customerCookie);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('should allow admin to access admin dashboard stats', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalCustomers).toBeGreaterThan(0);
    expect(res.body.data.totalSimulatedBalance).toBeGreaterThan(0);
  });

  it('should allow admin to view list of all customer accounts without password hashes', async () => {
    const res = await request(app)
      .get('/api/admin/customers')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const firstCustomer = res.body.data[0];
    expect(firstCustomer.email).toBeDefined();
    expect(firstCustomer.passwordHash).toBeUndefined(); // Security check
  });
});
