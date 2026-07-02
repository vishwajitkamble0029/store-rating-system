const { body } = require('express-validator');
const { addressRule } = require('./authValidator');

const createStoreValidator = [
  body('name').trim().isLength({ min: 1, max: 60 }).withMessage('Store name must be between 1 and 60 characters'),
  body('email').trim().isEmail().withMessage('A valid store email is required').normalizeEmail(),
  addressRule,
  body('ownerId').optional().isInt().withMessage('ownerId must be a valid integer'),
];

module.exports = { createStoreValidator };
