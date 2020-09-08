
const unitedStates = require(`../src/covidData/unitedStates`)
 
const express = require(`express`)
const router = express.Router()

router.get(`/us`, async function(req, res) {
  console.log(`covidData/united-states: Get Current US Numbers...`)

  try{
    const data = await unitedStates.getCurrent()
    res.send(data[0])
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/lastUpdated`, async function(req, res) {
  console.log(`covidData/united-states: Get US Last Updated...`)

  try{
    const data = await unitedStates.getCurrent()
    res.send(data.lastModified)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/daily`, async function(req, res) {
  console.log(`covidData/united-states: Get US historical records...`)

  try{
    const data = await unitedStates.getDailyUS()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/dates`, async function(req, res) {
  console.log(`covidData/united-states: Get US historical records starting and ending dates...`)

  try{
    const data = await unitedStates.getUSDates()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/:date`, async function(req, res) {
  console.log(`covidData/united-states: Get US Numbers on ${req.params.date}...`)

  try{
    const data = await unitedStates.getUSOnDate(req.params.date)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid Date: ${req.params.date}`)
  }
})

router.get(`/states`, async function(req, res) {
  console.log(`covidData/united-states: Get Current All States Numbers...`)

  try{
    const data = await unitedStates.getCurrentStates()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/:state`, async function(req, res) {
  console.log(`covidData/united-states: Get Current ${req.params.state} State Numbers...`)

  try{
    const data = await unitedStates.getCurrentState(req.params.state)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid State: ${req.params.state}`)
  }
})

router.get(`/:state/lastUpdated`, async function(req, res) {
  console.log(`covidData/united-states: Get ${req.params.state} Last Updated...`)

  try{
    const data = await unitedStates.getCurrentState(req.params.state)
    res.send(data.lastUpdateEt)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/:state/daily`, async function(req, res) {
  console.log(`covidData/united-states: Get ${req.params.state} State historical records...`)

  try{
    const data = await unitedStates.getDailyState(req.params.state)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid State: ${req.params.state}`)
  }
})

router.get(`/:state/dates`, async function(req, res) {
  console.log(`covidData/united-states: Get ${req.params.state} State historical records starting and ending dates of...`)

  try{
    const data = await unitedStates.getStateDates(req.params.state)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid State: ${req.params.state}`)
  }
})

router.get(`/:state/:date`, async function(req, res) {
  console.log(`covidData/united-states: Get Current ${req.params.state} State Numbers on ${req.params.date}...`)

  try{
    const data = await unitedStates.getStateOnDate(req.params.state, req.params.date)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid Inputs: ${req.params.state} ${req.params.date}`)
  }
})

module.exports = router