const Anime = require('../../models/animes')
const Sites = require('../../models/sites')
const Service = require('../../services/anime')
const { AuthenticationError } = require('apollo-server-express')
const { getHome } = require('../../scrape')

module.exports = {
  Query: {
    async anime(_root, args) {
      return Service.get(args)
    },
    async search(_root, args) {
      return Service.search(args.query)
    },
    async allAnime() {
      return (await Anime.findAll({ include: Sites })).map((it) => it.serialize())
    },
    async home(_root, args) {
      return await getHome(args.site)
    }
  },
  Mutation: {
    async update(_root, args, { auth = null }) {
      if (!auth) {
        throw new AuthenticationError('Invalid token')
      } else {
        return Service.update(args.params)
      }
    },
    async insertBatch(_root, args, { auth = null }) {
      if (!auth) {
        throw new AuthenticationError('Invalid token')
      } else {
        return Service.insert(args.params)
      }
    }
  }
}
