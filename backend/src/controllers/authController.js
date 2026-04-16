const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (role && !['manager', 'hustler'].includes(role)) {
      return res.status(400).json({ message: 'Role must be manager or hustler.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or phone already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);
    const user = new User({ name, email, phone, password: hashedPassword, role: role || 'hustler' });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email/phone and password required.' });
    }

    const user = await User.findOne(email ? { email } : { phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.accountStatus === 'locked') {
      return res.status(403).json({ message: 'Account is locked.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
