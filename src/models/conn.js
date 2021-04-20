const Sequelize = require('sequelize')
require('dotenv').config()

const init = () => {
  const { DB_HOST, DB_USER, DB_DB, DB_PASS } = process.env
  const sequelize = new Sequelize(DB_DB | 'new_anime_api', DB_USER | 'postgres', DB_PASS | '1234', {
    host: DB_HOST | '127.0.0.1',
    dialect: 'postgres',
    logging: false,
  })

  return sequelize
}

module.exports = { sequelize: init() }
