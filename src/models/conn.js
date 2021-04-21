const Sequelize = require('sequelize')
require('dotenv').config()

const init = () => {
  const sequelize = new Sequelize(process.env.DB_URL, { dialect: 'postgres', logging: false })
  return sequelize
}

module.exports = { sequelize: init() }
