const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('./config/env');

const app = express();
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const walletRoutes = require('./routes/wallet');
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB connection
async function connectDb() {
  await mongoose.connect(env.mongoUri);
}

if (require.main === module) {
  connectDb()
    .then(() => {
      app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { app, connectDb };
