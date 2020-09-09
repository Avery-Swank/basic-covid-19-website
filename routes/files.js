
const express = require('express')
const path = require(`path`)
const router = express.Router()

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'world.html'))
})

router.get('/us', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'us.html'))
})

router.get('/style', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'website.css'))
})

router.get('/us.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'us.js'))
})

router.get('/world.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'world.js'))
})

router.get('/states.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../src', '/covidData', 'states.json'))
})

router.get('/countries.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../src', '/covidData', 'countries.json'))
})

module.exports = router