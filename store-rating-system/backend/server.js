require('dotenv').config();
const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('./models'); // ensures associations are registered

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // Sync models to DB (creates tables if they don't exist).
  // In production, prefer running database/schema.sql + migrations instead of alter:true.
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
