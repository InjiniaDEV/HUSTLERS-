// tests/user.test.js
// Tests for user profile management and KYC endpoints
// Uses Jest and Supertest

const request = require('supertest');
const app = require('../src/index');

describe('User API', () => {
  let token;

  beforeAll(async () => {
    // Login to get JWT token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'TestPass123'
      });
    token = res.body.token;
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });

  // Add more tests for profile update, KYC upload, etc.
});
