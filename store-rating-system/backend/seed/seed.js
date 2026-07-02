require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('../models');

const hash = async (plain) => bcrypt.hash(plain, 10);

const seed = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables

  console.log('🌱 Seeding database...');

  const adminPassword = await hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234');
  const admin = await User.create({
    name: process.env.DEFAULT_ADMIN_NAME || 'System Administrator Account User',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@storerating.com',
    password: adminPassword,
    address: '1 Admin Plaza, Metropolis',
    role: 'ADMIN',
  });

  const ownerPassword = await hash('Owner@1234');
  const owner1 = await User.create({
    name: 'Johnathan Alexander Whitmore III',
    email: 'owner1@storerating.com',
    password: ownerPassword,
    address: '221B Baker Street, London',
    role: 'OWNER',
  });
  const owner2 = await User.create({
    name: 'Genevieve Isabella Montgomery-Clarke',
    email: 'owner2@storerating.com',
    password: ownerPassword,
    address: '742 Evergreen Terrace, Springfield',
    role: 'OWNER',
  });

  const userPassword = await hash('User@1234');
  const user1 = await User.create({
    name: 'Benjamin Alexander Harrington Cole',
    email: 'user1@storerating.com',
    password: userPassword,
    address: '10 Downing Street, London',
    role: 'USER',
  });
  const user2 = await User.create({
    name: 'Samantha Elizabeth Fairweather Jones',
    email: 'user2@storerating.com',
    password: userPassword,
    address: '350 Fifth Avenue, New York',
    role: 'USER',
  });

  const store1 = await Store.create({
    name: 'Green Valley Grocers',
    email: 'greenvalley@storerating.com',
    address: '12 Market Street, Springfield',
    ownerId: owner1.id,
  });
  const store2 = await Store.create({
    name: 'Blue Horizon Electronics',
    email: 'bluehorizon@storerating.com',
    address: '88 Tech Park, Metropolis',
    ownerId: owner1.id,
  });
  const store3 = await Store.create({
    name: 'Sunset Bakery & Cafe',
    email: 'sunsetbakery@storerating.com',
    address: '5 Riverside Lane, London',
    ownerId: owner2.id,
  });

  await Rating.bulkCreate([
    { userId: user1.id, storeId: store1.id, rating: 5 },
    { userId: user2.id, storeId: store1.id, rating: 4 },
    { userId: user1.id, storeId: store2.id, rating: 3 },
    { userId: user2.id, storeId: store3.id, rating: 5 },
    { userId: user1.id, storeId: store3.id, rating: 4 },
  ]);

  console.log('✅ Seed complete!');
  console.log('----------------------------------------');
  console.log(`Admin login:  ${admin.email} / ${process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234'}`);
  console.log(`Owner login:  ${owner1.email} / Owner@1234`);
  console.log(`User login:   ${user1.email} / User@1234`);
  console.log('----------------------------------------');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
