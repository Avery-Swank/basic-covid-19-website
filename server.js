
const filesRoutes = require(`./routes/files`)
const dataRoutes = require(`./routes/data`)
const covidDataRoutes = require(`./routes/covidData`)
const timeDateRoutes = require(`./routes/timeDate`)

const express = require(`express`)
const app = express()
const port = 3000

app.use(`/`, filesRoutes)
app.use(`/data`, dataRoutes)
app.use(`/covidData`, covidDataRoutes)
app.use(`/timeDate`, timeDateRoutes)

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})