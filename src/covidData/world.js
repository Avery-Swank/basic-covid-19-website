
const superagent = require(`superagent`)
const moment = require(`moment`)
const sleep = require(`sleep-promise`)

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
  await sleep(50)

  const res = await superagent.get(`${api}/total/country/${country}`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getCountryHistorySince
 * @description
 *  Get the current historical numbers in a country since a certain date
 *  Same as 'getCuontryHistory' but slices off whatever comes before 'since'
 *  'since' is of format: YYYY-MM-DD
 */
const getCountryHistorySince = async (country, since) => {
  await sleep(50)

  const today = moment()
  const numDays = today.diff(since, `days`)

  const res = await superagent.get(`${api}/total/country/${country}`)
  const data = JSON.parse(res.text)
  return data.slice(data.length - numDays, data.length)
}

module.exports = {
  getCurrent,
  getSummary,
  getCountryHistory,
  getCountryHistorySince
}