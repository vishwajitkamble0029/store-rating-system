const bcrypt = require('bcryptjs');
const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

// @route GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  res.json({
    success: true,
    data: { totalUsers, totalStores, totalRatings },
  });
};

// @route POST /api/admin/users
// @desc  Admin creates a user with any role (ADMIN, USER, OWNER)
const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

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
    role: role || 'USER',
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
  });
};

// @route POST /api/admin/stores
// @desc  Admin creates a store, optionally assigning an owner
const createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  const existing = await Store.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Store email already in use' });
  }

  if (ownerId) {
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Specified owner does not exist' });
    }
    if (owner.role !== 'OWNER') {
      return res.status(400).json({ success: false, message: 'Assigned user must have the OWNER role' });
    }
  }

  const store = await Store.create({ name, email, address, ownerId: ownerId || null });

  res.status(201).json({ success: true, message: 'Store created successfully', store });
};

// @route GET /api/admin/stores
// @desc  List stores with search, filter, sort, pagination and average rating
const listStores = async (req, res) => {
  const { search = '', name, email, address, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

  const where = {};
  const andConditions = [];

  if (search) {
    andConditions.push({
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ],
    });
  }
  if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });
  if (email) andConditions.push({ email: { [Op.like]: `%${email}%` } });
  if (address) andConditions.push({ address: { [Op.like]: `%${address}%` } });

  if (andConditions.length) where[Op.and] = andConditions;

  const allowedSort = ['name', 'email', 'address', 'createdAt', 'averageRating'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await Store.findAndCountAll({
    where,
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      { model: Rating, as: 'ratings', attributes: [] },
    ],
    attributes: {
      include: [[fn('ROUND', fn('AVG', col('ratings.rating')), 2), 'averageRating']],
    },
    group: ['Store.id', 'owner.id'],
    subQuery: false,
    order: sortField === 'averageRating' ? [[literal('averageRating'), order]] : [[sortField, order]],
    limit: Number(limit),
    offset,
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: Array.isArray(count) ? count.length : count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / Number(limit)),
    },
  });
};

// @route GET /api/admin/users
// @desc  List users with search, filter, sort, pagination
const listUsers = async (req, res) => {
  const { search = '', name, email, address, role, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

  const andConditions = [];
  if (search) {
    andConditions.push({
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ],
    });
  }
  if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });
  if (email) andConditions.push({ email: { [Op.like]: `%${email}%` } });
  if (address) andConditions.push({ address: { [Op.like]: `%${address}%` } });
  if (role) andConditions.push({ role });

  const where = andConditions.length ? { [Op.and]: andConditions } : {};

  const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[sortField, order]],
    limit: Number(limit),
    offset,
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  });
};

// @route GET /api/admin/users/:id
// @desc  Get single user details. If OWNER, include owned stores + average rating.
const getUserDetails = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  let responseData = { ...user.toJSON() };

  if (user.role === 'OWNER') {
    const stores = await Store.findAll({
      where: { ownerId: user.id },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: {
        include: [[fn('ROUND', fn('AVG', col('ratings.rating')), 2), 'averageRating']],
      },
      group: ['Store.id'],
      subQuery: false,
    });

    const overallAvgResult = await Rating.findOne({
      include: [{ model: Store, as: 'store', where: { ownerId: user.id }, attributes: [] }],
      attributes: [[fn('ROUND', fn('AVG', col('Rating.rating')), 2), 'overallAverage']],
      raw: true,
    });

    responseData.stores = stores;
    responseData.overallAverageRating = overallAvgResult ? overallAvgResult.overallAverage : null;
  }

  res.json({ success: true, data: responseData });
};

// @route GET /api/admin/owners
// @desc  Helper endpoint to list all users with OWNER role (for store-assignment dropdown)
const listOwners = async (req, res) => {
  const owners = await User.findAll({
    where: { role: 'OWNER' },
    attributes: ['id', 'name', 'email'],
    order: [['name', 'ASC']],
  });
  res.json({ success: true, data: owners });
};

module.exports = {
  getDashboard,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetails,
  listOwners,
};
