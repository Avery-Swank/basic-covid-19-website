 
const express = require(`express`)
const router = express.Router()

router.get(`/states`, async function(req, res) {
  console.log(`data: Get States Basic Information...`)

  try{
    const data = require(`../data/states.json`)
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

router.get(`/countries`, async function(req, res) {
  console.log(`data: Get Countires Basic Information...`)

  try{
    const data = require(`../data/countries.json`)
    res.send(data)
  } catch (e) {
    res.status(400).send()
  }
})

module.exports = router