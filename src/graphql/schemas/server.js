const { gql } = require('apollo-server-express')

module.exports = gql`
  type Server {
    name: String!
    url: String!
    web: String!
  }

  type ServerList {
      site: String!
      servers: [Server!]!
      anime: Anime
      episode: Int
  }

  extend type Query {
    getServers(idMal: Int!, episode: Int!): [ServerList]
  }
`
