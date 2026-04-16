const dotenv = require('dotenv');

dotenv.config();

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hustlers',
  jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

if (env.nodeEnv === 'production' && env.jwtSecret === 'development-jwt-secret-change-me') {
  throw new Error('JWT_SECRET must be set to a strong value in production.');
}

module.exports = env;
