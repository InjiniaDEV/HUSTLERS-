const request = require('supertest');
const {
  initTestServer,
  clearDatabase,
  teardownTestServer,
  registerAndLogin,
} = require('./testSetup');

let app;

describe('User Profile API', () => {
  beforeAll(async () => {
    app = await initTestServer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestServer();
  });

  it('returns authenticated user profile from /api/auth/me', async () => {
    const { token } = await registerAndLogin({
      name: 'Profile User',
      email: 'profile@example.com',
      phone: '+254700000001',
      password: 'TestPass123',
      role: 'hustler',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('profile@example.com');
    expect(res.body.user).toHaveProperty('role', 'hustler');
  });
});
