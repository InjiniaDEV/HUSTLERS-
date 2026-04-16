const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Registration
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

router.get('/me', authMiddleware, async (req, res) => {
	const user = await User.findById(req.user.id).select('-password');
	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}

	return res.status(200).json({ user });
});

module.exports = router;
