const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('NNPTUD-C4', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
