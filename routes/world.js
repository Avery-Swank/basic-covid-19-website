
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

module.exports = router