import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Health Check API', () => {
  const app = createApp();

  it('GET /api/health should respond with API status and service name', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBeOneOf([200, 503]); // 503 when DB not connected in unit test, 200 when connected
    expect(res.body).toHaveProperty('service', 'Shree Ji Fast Food API');
    expect(res.body).toHaveProperty('database');
  });

  it('GET /api/nonexistent-route should return 404 with structured error', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });
});
