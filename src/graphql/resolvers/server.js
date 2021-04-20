const Service = require('../../services/server')

module.exports = {
  Query: {
    async getServers(root, args, context) {
      return await Service.get(args)
    },
  }
}
