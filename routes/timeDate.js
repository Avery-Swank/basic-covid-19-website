
const express = require('express')
const router = express.Router()

const timeDate = require(`../src/timeDate/timeDate`)

router.get('/today', function(req, res) {
  res.send(timeDate.getToday())
})

module.exports = router