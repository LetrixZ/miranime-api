const { gql } = require('apollo-server-express');
const animeType = require('./anime');
const siteType = require('./site');
const serverType = require('./server');

const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, animeType, siteType, serverType];
