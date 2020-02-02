const Sequelize = require('sequelize');

//will setup a connection pool
const sequelize = new Sequelize('node-complete', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});

modules.exports = sequelize;