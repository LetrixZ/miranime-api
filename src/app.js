const express = require('express');
const { createServer } = require('http');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Anime = require('./models/animes');
const Sites = require('./models/sites');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');

const app = express();

dotenv.config();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token == process.env.TOKEN_SECRET) next();
    else res.sendStatus(403);
  } else {
    res.sendStatus(401);
  }
};

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
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

app.get('/', (_, res) => {
  res.json({
    message: 'miranime-api by LetrixZ',
  });
});

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// app.get('/:id', async (req, res) => {
  // res.json(await (await Anime.findOne({ where: { idMal: req.params.id }, include: { model: Sites, as: 'sites' } })).serialize());
// });

app.post('/', authenticateJWT, (req, res) => {
  const animeList = req.body;
  animeList.forEach(async (item) => {
    let entry = await Anime.findOne({ where: { idMal: item.id_mal } });
    if (entry == null) {
      entry = await Anime.create({
        idMal: item.id_mal,
        idAl: item.id_al || null,
        title: item.title,
        type: item.type?.toLowerCase(),
        state: item.status || 0,
        episodes: item.episodes || 0,
        year: item.year || null,
        season: item.season?.toLowerCase() || null,
        synopsis: item.synopsis || null,
        synonyms: item.synonyms?.join('|') || null,
        genres: item.genres?.join('|') || null,
        poster: item.poster || null,
        banner: item.banner || null,
      });
    }
    item.streaming_sites.forEach(async (site) => {
      let siteEntry = await Sites.findOne({ where: { animeId: entry.id, name: site.name, link: site.id } });
      if (siteEntry == null) {
        await Sites.create({
          animeId: entry.id,
          name: site.name,
          link: site.id,
        });
      }
    });
  });
  res.send('completed');
});

const server = createServer(app);

module.exports = server;
