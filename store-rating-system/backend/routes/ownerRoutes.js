const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('OWNER'));

router.get('/dashboard', getDashboard);

module.exports = router;
