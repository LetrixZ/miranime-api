const server = require('./app')
const { sequelize } = require('./models/conn')

const port = process.env.PORT || 4000
sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
  })
})