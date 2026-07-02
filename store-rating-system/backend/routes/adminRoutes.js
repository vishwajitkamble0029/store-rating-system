const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetails,
  listOwners,
} = require('../controllers/adminController');
const { createUserValidator, listQueryValidator } = require('../validators/userValidator');
const { createStoreValidator } = require('../validators/storeValidator');
const validate = require('../validators/validate');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getDashboard);

router.post('/users', createUserValidator, validate, createUser);
router.get('/users', listQueryValidator, validate, listUsers);
router.get('/users/:id', getUserDetails);

router.post('/stores', createStoreValidator, validate, createStore);
router.get('/stores', listQueryValidator, validate, listStores);

router.get('/owners', listOwners);

module.exports = router;
