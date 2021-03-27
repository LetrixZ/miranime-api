const server = require('./app');
const { sequelize } = require('./models/conn');
// const Animes = require('./models/animes');
// const Sites = require('./models/sites');

const port = process.env.PORT || 4000;
sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
});