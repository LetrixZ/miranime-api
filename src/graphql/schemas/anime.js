const { gql } = require('apollo-server-express')

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
    latestEpisode: Int
    synonyms: [String!]
    genres: [String!]
    poster: String
    banner: String
    thumbnail: String
    sites: [Site!]
  }

  type AnimeList {
    title: String!
    list: [Anime!]!
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
    banner: String,
    sites: [SiteI!]
  }

  input SiteI {
    animeId: Int
    title: String
    id: String!
    name: String!
  }

  extend type Query {
    anime(id: Int, idMal: Int, idAl: Int, update: Boolean): Anime
    search(query: String!): [Anime!]
    allAnime: [Anime]
    home(site: String): [AnimeList!]
  }

  extend type Mutation {
    update(params: [UpdateParams!]!): [Anime!]
    insertBatch(params: [UpdateParams!]!): [Anime]
  }
`
