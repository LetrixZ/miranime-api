const { gql } = require('apollo-server-express');

module.exports = gql`
  type Anime {
    id: Int
    idMal: Int
    idAl: Int
    title: String
    type: String
    synopsis: String
    state: Int
    year: Int
    season: String
    episodes: Int
    synonyms: [String!]
    genres: [String!]
    poster: String
    banner: String
    sites: [Site!]
  }

  input UpdateParams {
    id: Int
    idMal: Int
    idAl: Int
    title: String
    type: String
    synopsis: String
    state: Int
    year: Int
    season: String
    episodes: Int
    synonyms: [String!]
    genres: [String!]
    poster: String
    banner: String
  }

  extend type Query {
    anime(id: Int, idMal: Int, idAl: Int, update: Boolean): Anime
    search(query: String!): [Anime!]
    allAnime: [Anime]
  }

  extend type Mutation {
    update(params: [UpdateParams!]!): [Anime!]
  }
`;
