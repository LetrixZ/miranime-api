const { Model, DataTypes: type } = require('sequelize')
const { getSiteName } = require('../scrape/utils')
const Anime = require('./animes')
const { sequelize } = require('./conn')
class Sites extends Model { }

Sites.init(
  {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    animeId: { type: type.INTEGER, allowNull: false, field: 'anime_id' },
    name: { type: type.STRING, allowNull: false },
    link: { type: type.TEXT, allowNull: false },
    uid: { type: type.TEXT, unique: true, allowNull: false }
  },
  { modelName: 'sites', sequelize, createdAt: 'created_at', updatedAt: 'updated_at' }
)

Sites.afterSync(async () => {
  const sites = await Sites.findAll()
  sites.forEach(it => {
    it.update({
      uid: `${getSiteName(it.name)}-${it.link}`
    })
  })
})

module.exports = Sites
