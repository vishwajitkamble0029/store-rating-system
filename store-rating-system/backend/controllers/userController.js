const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');

// @route GET /api/user/stores
// @desc  List all stores with overall rating + this user's submitted rating; search by name/address
const listStores = async (req, res) => {
  const { search = '', name, address, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  const andConditions = [];
  if (search) {
    andConditions.push({
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { address: { [Op.like]: `%${search}%` } }],
    });
  }
  if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });
  if (address) andConditions.push({ address: { [Op.like]: `%${address}%` } });

  const where = andConditions.length ? { [Op.and]: andConditions } : {};

  const allowedSort = ['name', 'address', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await Store.findAndCountAll({
    where,
    attributes: {
      include: [[fn('ROUND', fn('AVG', col('ratings.rating')), 2), 'overallRating']],
    },
    include: [{ model: Rating, as: 'ratings', attributes: [] }],
    group: ['Store.id'],
    subQuery: false,
    order: [[sortField, order]],
    limit: Number(limit),
    offset,
  });

  const storeIds = rows.map((s) => s.id);
  const userRatings = await Rating.findAll({
    where: { userId, storeId: { [Op.in]: storeIds } },
  });
  const userRatingMap = {};
  userRatings.forEach((r) => {
    userRatingMap[r.storeId] = { rating: r.rating, ratingId: r.id };
  });

  const data = rows.map((store) => ({
    ...store.toJSON(),
    userSubmittedRating: userRatingMap[store.id]?.rating || null,
    ratingId: userRatingMap[store.id]?.ratingId || null,
  }));

  res.json({
    success: true,
    data,
    pagination: {
      total: Array.isArray(count) ? count.length : count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / Number(limit)),
    },
  });
};

// @route POST /api/user/ratings
// @desc  Submit a new rating (1 per user per store)
const submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  const store = await Store.findByPk(storeId);
  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const existing = await Rating.findOne({ where: { userId, storeId } });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'You have already rated this store. Use update instead.',
    });
  }

  const newRating = await Rating.create({ userId, storeId, rating });
  res.status(201).json({ success: true, message: 'Rating submitted successfully', data: newRating });
};

// @route PUT /api/user/ratings/:id
// @desc  Update the authenticated user's own rating
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  const existing = await Rating.findByPk(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Rating not found' });
  }
  if (existing.userId !== userId) {
    return res.status(403).json({ success: false, message: 'You can only update your own ratings' });
  }

  existing.rating = rating;
  await existing.save();

  res.json({ success: true, message: 'Rating updated successfully', data: existing });
};

module.exports = { listStores, submitRating, updateRating };
