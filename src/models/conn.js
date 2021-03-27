const Sequelize = require('sequelize');
// require('dotenv').config();

const init = () => {
  // const { DB_HOST, DB_USER, DB_DB, DB_PASS } = process.env;
  const sequelize = new Sequelize('anime_api_js', 'postgres', '1234', {
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
  });
  // Sequelize will keep the connection open by default, and use the same connection for all queries.
  // If you need to close the connection, call sequelize.close() (which is asynchronous and returns a Promise).

  return sequelize;
};

module.exports = { sequelize: init() };
