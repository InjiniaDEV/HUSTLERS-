const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or phone already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
