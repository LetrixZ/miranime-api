const Site = require('../../models/sites');

module.exports = {
  Query: {
    async getAllSites(root, args, context) {
      console.log('testo');
      return {
          id: '',
          name: ''
      }
    },
  },
};
