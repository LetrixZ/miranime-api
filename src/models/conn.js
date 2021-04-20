const Sequelize = require('sequelize');
require('dotenv').config();

const init = () => {
  const { DB_HOST, DB_USER, DB_DB, DB_PASS } = process.env;
  const sequelize = new Sequelize('new_anime_api', 'postgres', '1234', {
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
  });

  return sequelize;
};

module.exports = { sequelize: init() };
