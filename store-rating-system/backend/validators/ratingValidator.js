const { body } = require('express-validator');

const submitRatingValidator = [
  body('storeId').isInt().withMessage('storeId is required and must be an integer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be an integer between 1 and 5'),
];

const updateRatingValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be an integer between 1 and 5'),
];

module.exports = { submitRatingValidator, updateRatingValidator };
