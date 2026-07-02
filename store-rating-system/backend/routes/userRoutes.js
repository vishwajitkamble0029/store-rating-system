const express = require('express');
const router = express.Router();
const { listStores, submitRating, updateRating } = require('../controllers/userController');
const { submitRatingValidator, updateRatingValidator } = require('../validators/ratingValidator');
const validate = require('../validators/validate');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('USER'));

router.get('/stores', listStores);
router.post('/ratings', submitRatingValidator, validate, submitRating);
router.put('/ratings/:id', updateRatingValidator, validate, updateRating);

module.exports = router;
