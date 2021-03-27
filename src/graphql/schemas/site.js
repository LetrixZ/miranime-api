const { gql } = require('apollo-server-express');

module.exports = gql`
  type Site {
    id: String!
    name: String!
  }

  extend type Query {
    getAllSites: Site
  }

`;
