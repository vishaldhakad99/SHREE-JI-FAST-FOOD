import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';

describe('Auth & Protected Routes API', () => {
  const app = createApp();
  process.env.JWT_SECRET = 'test_jwt_secret_key_minimum_32_characters_long';

  it('POST /api/auth/login should reject empty body with 400 validation error', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
  });

  it('POST /api/auth/login should reject invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('GET /api/auth/me should reject request without token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Authentication required');
  });

  it('GET /api/auth/me should reject invalid token with 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.value');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me should reject expired token with 401', async () => {
    const expiredToken = jwt.sign(
      { id: '507f1f77bcf86cd799439011', email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '-1s' }
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Session has expired');
  });

  it('POST /api/auth/logout should clear cookie and respond with 200', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie'][0]).toContain('admin_token=;');
  });
});
