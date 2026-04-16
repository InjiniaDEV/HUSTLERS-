const request = require('supertest');
const {
  initTestServer,
  clearDatabase,
  teardownTestServer,
} = require('./testSetup');

let app;

describe('Authentication API', () => {
  beforeAll(async () => {
    app = await initTestServer();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestServer();
  });

  it('registers a new user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestPass123',
        phone: '+1234567890',
        role: 'manager',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: 'testuser@example.com',
      role: 'manager',
    });
  });

  it('logs in an existing user with email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testlogin@example.com',
        password: 'TestPass123',
        phone: '+1987654321',
        role: 'hustler',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testlogin@example.com',
        password: 'TestPass123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testlogin@example.com');
  });

  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'missing@example.com',
        password: 'WrongPass123',
      });

    expect(res.statusCode).toBe(401);
  });
});
