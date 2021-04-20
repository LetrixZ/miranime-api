const { DataTypes: type, Model } = require('sequelize')
const { sequelize } = require('./conn')
const Sites = require('./sites')
class Anime extends Model { }

Anime.init(
  {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    idMal: { type: type.INTEGER, field: 'id_mal', unique: true },
    idAl: { type: type.INTEGER, field: 'id_al', unique: true },
    title: { type: type.TEXT, allowNull: false },
    type: { type: type.STRING, allowNull: false },
    state: { type: type.INTEGER, allowNull: false },
    episodes: { type: type.INTEGER },
    year: { type: type.INTEGER },
    season: { type: type.STRING },
    synopsis: { type: type.TEXT },
    synonyms: { type: type.TEXT },
    genres: { type: type.TEXT },
    poster: { type: type.TEXT },
    banner: { type: type.TEXT },
  },
  { modelName: 'animes', sequelize, createdAt: 'created_at', updatedAt: 'updated_at' }
)

Anime.hasMany(Sites, { foreignKey: 'anime_id', onDelete: 'CASCADE' })
Sites.belongsTo(Anime, {
  foreignKey: 'anime_id',
})


const Serializer = require('sequelize-to-json')

const map = async (item) => {
  return {
    ...item,
    synonyms: item.synonyms?.split('|'),
    genres: item.genres?.split('|'),
    sites: item.sites?.map(it => {
      return {
        name: it.name,
        id: it.link
      }
    }) || null
  }
}

const scheme = {
  include: ['@all', 'sites'],
  exclude: ['created_at', 'updated_at'],
  assoc: {
    sites: {
      include: ['@all'],
    },
  },
  postSerialize: map,
}

Anime.prototype.serialize = function () {
  return new Serializer(Anime, scheme).serialize(this)
}

Anime.afterSync(async () => {
  const animes = await Anime.findAll()
  animes.forEach(anime => {
    if (anime.poster.includes('.jpg.jpg')) {
      // anime.poster = `https://cdn.myanimelist.net/images/anime/${anime.poster.split('/')[7]}/${anime.poster.split('/')[8].split('?')[0]}.jpg`
      anime.poster = anime.poster.replace('.jpg.jpg', '.jpg')
      anime.save()
    }
  })
})

module.exports = Anime
