const { body, query } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./authValidator');

const createUserValidator = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule('password'),
  body('role').optional().isIn(['ADMIN', 'USER', 'OWNER']).withMessage('Role must be ADMIN, USER, or OWNER'),
];

const listQueryValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['ASC', 'DESC', 'asc', 'desc']),
];

module.exports = { createUserValidator, listQueryValidator };
