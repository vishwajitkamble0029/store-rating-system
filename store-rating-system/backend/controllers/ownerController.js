const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// @route GET /api/owner/dashboard
// @desc  Average rating across all owned stores + list of users who rated each store
const getDashboard = async (req, res) => {
  const ownerId = req.user.id;

  const stores = await Store.findAll({
    where: { ownerId },
    attributes: {
      include: [[fn('ROUND', fn('AVG', col('ratings.rating')), 2), 'averageRating']],
    },
    include: [{ model: Rating, as: 'ratings', attributes: [] }],
    group: ['Store.id'],
    subQuery: false,
  });

  const storeIds = stores.map((s) => s.id);

  const ratingsDetail = await Rating.findAll({
    where: { storeId: storeIds },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Store, as: 'store', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  const overallResult = await Rating.findOne({
    include: [{ model: Store, as: 'store', where: { ownerId }, attributes: [] }],
    attributes: [[fn('ROUND', fn('AVG', col('Rating.rating')), 2), 'overallAverage']],
    raw: true,
  });

  res.json({
    success: true,
    data: {
      overallAverageRating: overallResult ? overallResult.overallAverage : null,
      stores,
      raters: ratingsDetail.map((r) => ({
        id: r.id,
        userName: r.user.name,
        userEmail: r.user.email,
        storeName: r.store.name,
        rating: r.rating,
        ratedDate: r.createdAt,
      })),
    },
  });
};

module.exports = { getDashboard };
