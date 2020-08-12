
const express = require('express')
const path = require(`path`)
const router = express.Router()

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'home.html'))
})

router.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'about.html'))
})

router.get('/style', function(req, res) {
  res.sendFile(path.join(__dirname, '../html', 'website.css'))
})

module.exports = router