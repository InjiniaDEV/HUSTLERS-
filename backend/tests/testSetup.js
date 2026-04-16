const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let mongoServer;
let app;

async function initTestServer() {
  process.env.JWT_SECRET = 'test-secret';

  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
  }

  const serverModule = require('../src/index');
  app = serverModule.app;

  if (mongoose.connection.readyState === 0) {
    await serverModule.connectDb();
  }

  return app;
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}

async function teardownTestServer() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

async function registerAndLogin({
  name,
  email,
  phone,
  password,
  role,
  kycStatus,
}) {
  const server = app || (await initTestServer());

  const registerResponse = await request(server)
    .post('/api/auth/register')
    .send({ name, email, phone, password, role });

  if (kycStatus) {
    const User = require('../src/models/User');
    await User.updateOne({ email }, { kycStatus });
  }

  const loginResponse = await request(server)
    .post('/api/auth/login')
    .send({ email, password });

  return {
    registerResponse,
    loginResponse,
    token: loginResponse.body.token,
    user: loginResponse.body.user,
  };
}

module.exports = {
  initTestServer,
  clearDatabase,
  teardownTestServer,
  registerAndLogin,
};
