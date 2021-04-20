const Site = require('../../models/sites')
const Service = require('../../services/site')

module.exports = {
  Query: {
    async getAllSites(root, args, context) {
      console.log('testo')
      return {
        id: '',
        name: ''
      }
    },
  },
  Mutation: {
    async siteInsertBatch(_root, args, { auth = null }) {
      if (!auth) {
        throw new AuthenticationError('Invalid token')
      } else {
        return Service.insert(args.params)
      }
    }
  }
}
