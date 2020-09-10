
const world = require(`../src/covidData/world`)
 
const express = require(`express`)
const router = express.Router()

router.get(`/current`, async function(req, res) {
  console.log(`covidData/world: Get Current World Numbers...`)
  
  try{
    const data = await world.getCurrent()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/summary`, async function(req, res) {
  console.log(`covidData/world: Get Summary...`)
  
  try{
    const data = await world.getSummary()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/country/:country`, async function(req, res) {
  console.log(`covidData/world: Get Country ${req.params.country} History...`)
  
  try{
    const data = await world.getCountryHistory(req.params.country)
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/country/:country/:since`, async function(req, res) {
  console.log(`covidData/world: Get Country ${req.params.country} History since ${req.params.since}...`)
  
  try{
    const data = await world.getCountryHistorySince(req.params.country, req.params.since)
    res.send(data)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
})

module.exports = router