const express = require('express');
const router = express.Router();
const { register, login, logout, changePassword, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidator');
const validate = require('../validators/validate');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePasswordValidator, validate, changePassword);
router.get('/me', protect, getMe);

module.exports = router;
