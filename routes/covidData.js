
const covidData = require(`../src/covidData/covidData`)
 
const express = require(`express`)
const router = express.Router()

router.get(`/us`, async function(req, res) {
  console.log(`covidData: Get Current US Numbers...`)

  try{
    const data = await covidData.getCurrentUS()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/lastUpdated`, async function(req, res) {
  console.log(`covidData: Get US Last Updated...`)

  try{
    const data = await covidData.getCurrentUS()
    res.send(data.lastModified)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/dates`, async function(req, res) {
  console.log(`covidData: Get US starting and ending dates of historical records...`)

  try{
    const data = await covidData.getUSDates()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/us/:date`, async function(req, res) {
  console.log(`covidData: Get US Numbers on ${req.params.date}...`)

  try{
    const data = await covidData.getUSOnDate(req.params.date)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid Date: ${req.params.date}`)
  }
})

router.get(`/states`, async function(req, res) {
  console.log(`covidData: Get Current All States Numbers...`)

  try{
    const data = await covidData.getCurrentStates()
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/:state`, async function(req, res) {
  console.log(`covidData: Get Current ${req.params.state} State Numbers...`)

  try{
    const data = await covidData.getCurrentState(req.params.state)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid State: ${req.params.state}`)
  }
})

router.get(`/:state/lastUpdated`, async function(req, res) {
  console.log(`covidData: Get ${req.params.state} Last Updated...`)

  try{
    const data = await covidData.getCurrentState(req.params.state)
    res.send(data.lastUpdateEt)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/:state/dates`, async function(req, res) {
  console.log(`covidData: Get ${req.params.state} State starting and ending dates of historical records...`)

  try{
    const data = await covidData.getStateDates(req.params.state)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid State: ${req.params.state}`)
  }
})

router.get(`/:state/:date`, async function(req, res) {
  console.log(`covidData: Get Current ${req.params.state} State Numbers on ${req.params.date}...`)

  try{
    const data = await covidData.getStateOnDate(req.params.state, req.params.date)
    res.send(data)
  } catch (e) {
    res.status(400).send(`Invalid Inputs: ${req.params.state} ${req.params.date}`)
  }
})

module.exports = router