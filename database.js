const { Sequelize } = require('sequelize');

// Create a Sequelize instance, connecting to a MySQL database
const sequelize = new Sequelize('nodejs_poc', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // No changes needed here
});

module.exports = sequelize;
