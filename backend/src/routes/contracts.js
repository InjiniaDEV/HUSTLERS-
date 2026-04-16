const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const contractController = require('../controllers/contractController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', contractController.createContract);
router.get('/', contractController.listContracts);
router.get('/:contractId', contractController.getContractById);
router.patch('/:contractId/fund', contractController.fundContract);
router.patch('/:contractId/assign', contractController.assignContract);
router.patch('/:contractId/milestones/:milestoneId/submit', contractController.submitMilestone);
router.patch('/:contractId/milestones/:milestoneId/approve', contractController.approveMilestone);
router.patch('/:contractId/milestones/:milestoneId/reject', contractController.rejectMilestone);

module.exports = router;
