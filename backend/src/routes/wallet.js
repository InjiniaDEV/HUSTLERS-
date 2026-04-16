const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const walletController = require('../controllers/walletController');

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', walletController.getWalletBalance);
router.get('/transactions', walletController.getTransactionHistory);
router.post('/withdraw', walletController.withdrawFunds);

module.exports = router;
