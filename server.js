
const pagesRoutes = require(`./routes/pages`)
const covidDataRoutes = require(`./routes/covidData`)
const timeDateRoutes = require(`./routes/timeDate`)

const express = require(`express`)
const app = express()
const port = 3000

app.use(`/`, pagesRoutes)
app.use(`/covidData`, covidDataRoutes)
app.use(`/timeDate`, timeDateRoutes)

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})