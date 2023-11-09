const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

  
sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.DB_PASSWORD, {
         host: '127.0.0.1',     dialect: 'mysql', })            
module.exports = sequelizeInstance;

    