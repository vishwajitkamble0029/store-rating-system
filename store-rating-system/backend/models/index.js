const { sequelize } = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// One owner (User) -> many Stores
User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores', onDelete: 'CASCADE' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// One User -> many Ratings
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// One Store -> many Ratings
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = { sequelize, User, Store, Rating };
