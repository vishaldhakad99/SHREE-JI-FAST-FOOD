import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Security & Protection Tests', () => {
  const app = createApp();

  it('Responses should include Helmet security headers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
  });

  it('Protected admin endpoints should strictly reject unauthorized POST/PUT/DELETE calls', async () => {
    const endpoints = [
      { method: 'post', url: '/api/food' },
      { method: 'put', url: '/api/food/123' },
      { method: 'delete', url: '/api/food/123' },
      { method: 'post', url: '/api/daily-menu' },
      { method: 'put', url: '/api/settings' },
      { method: 'get', url: '/api/orders' },
      { method: 'patch', url: '/api/orders/123/status' },
      { method: 'get', url: '/api/contact' },
      { method: 'post', url: '/api/upload' },
    ];

    for (const ep of endpoints) {
      const res = await (request(app) as any)[ep.method](ep.url).send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    }
  });

  it('Order enquiry input validation must reject malicious or invalid payload', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'A', // too short (<2 chars)
        customerPhone: 'not-a-number',
        foodItemName: '',
        quantity: -5,
        deliveryType: 'drone_delivery', // invalid enum
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('Contact enquiry input validation must reject incomplete payload', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: '',
        phone: '123',
        message: 'hi', // too short (<5 chars)
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
