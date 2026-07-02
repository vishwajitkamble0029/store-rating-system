const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

// @route POST /api/auth/register
// @desc  Register a new normal user (public signup is always role=USER)
const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    role: 'USER',
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
  });
};

// @route POST /api/auth/login
// @desc  Login for all roles (ADMIN, USER, OWNER)
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
  });
};

// @route POST /api/auth/logout
// @desc  Stateless JWT logout (client discards token). Endpoint provided for API completeness.
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @route PUT /api/auth/change-password
// @desc  Authenticated user changes their own password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
};

// @route GET /api/auth/me
// @desc  Get currently authenticated user (used to persist login on refresh)
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, logout, changePassword, getMe };
