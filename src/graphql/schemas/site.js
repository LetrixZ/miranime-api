const { gql } = require('apollo-server-express')

module.exports = gql`
  type Site {
    id: String!
    name: String!
  }

  input SiteParams {
    id: String!
    name: String!
    anime: Int!
  }

  extend type Query {
    getAllSites: Site
  }

  extend type Mutation {
    siteInsertBatch(params: [SiteParams!]!): [Site]
  }

`
