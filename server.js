
const filesRoutes = require(`./routes/files`)
const dataRoutes = require(`./routes/data`)
const worldRoutes = require(`./routes/world`)
const unitedStatesRoutes = require(`./routes/unitedStates`)

const express = require(`express`)
const app = express()
const port = 3000

app.use(`/`, filesRoutes)
app.use(`/data`, dataRoutes)
app.use(`/covidData/world`, worldRoutes)
app.use(`/covidData/united-states`, unitedStatesRoutes)

app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port: ${port}`)
})