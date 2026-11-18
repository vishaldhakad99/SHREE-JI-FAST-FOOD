import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Customer Auth & OTP API', () => {
  const app = createApp();
  process.env.JWT_SECRET = 'test_jwt_secret_key_minimum_32_characters_long';

  it('POST /api/customer/send-otp should reject missing type with 400', async () => {
    const res = await request(app).post('/api/customer/send-otp').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/customer/send-otp should reject invalid phone numbers', async () => {
    const res = await request(app).post('/api/customer/send-otp').send({
      type: 'phone',
      identifier: '12345',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('valid 10-digit');
  });

  it('POST /api/customer/send-otp should reject invalid email format', async () => {
    const res = await request(app).post('/api/customer/send-otp').send({
      type: 'email',
      identifier: 'not-an-email',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('valid email');
  });

  it('POST /api/customer/verify-otp should reject missing identifier or code', async () => {
    const res = await request(app).post('/api/customer/verify-otp').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/customer/me should return 401 if unauthenticated', async () => {
    const res = await request(app).get('/api/customer/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/customer/logout should clear session', async () => {
    const res = await request(app).post('/api/customer/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
