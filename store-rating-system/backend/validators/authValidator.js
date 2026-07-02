const { body } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]/~`;']).{8,16}$/;

const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRule = body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail();

const addressRule = body('address')
  .optional({ checkFalsy: true })
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters');

const passwordRule = (field = 'password') =>
  body(field)
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    );

const registerValidator = [nameRule, emailRule, addressRule, passwordRule('password')];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  PASSWORD_REGEX,
};
