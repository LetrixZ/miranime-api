const express = require('express')
const { createServer } = require('http')
const morgan = require('morgan')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./graphql/schemas')
const resolvers = require('./graphql/resolvers')
const context = require('./graphql/context')

const app = express()

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    settings: {
      'schema.polling.enable': false,
    },
  },
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

app.get('/', (_, res) => {
  res.json({
    message: 'miranime-api by LetrixZ',
  })
})

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false, limit: '20mb' }))
app.use(express.json({ limit: '50mb' }))

const server = createServer(app)

module.exports = server
