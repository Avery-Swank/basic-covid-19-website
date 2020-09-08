
const superagent = require(`superagent`)
const moment = require(`moment`)

const api = `https://api.covid19api.com`

/**
 * @function getCurrent
 * @description
 *  Get the current numbers in the whole world
 */
const getCurrent = async () => {
  const res = await superagent.get(`${api}/world/total`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getSummary
 * @description
 *  Get the current numbers in all countries separated
 */
const getSummary = async () => {
  const res = await superagent.get(`${api}/summary`)
  const data = JSON.parse(res.text)
  return data.Countries
}

/**
 * @function getCountryHistory
 * @description
 *  Get the current historical numbers in a country
 */
const getCountryHistory = async (country) => {
  const res = await superagent.get(`${api}/country/${country}`)
  const data = JSON.parse(res.text)
  return data
}

module.exports = {
  getCurrent,
  getSummary,
  getCountryHistory
}