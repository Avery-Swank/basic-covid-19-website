
const superagent = require(`superagent`)

const { getAbbreviation } = require(`./states`)

const api = `https://api.covidtracking.com`

/**
 * @function getCurrentUS
 * @description
 *  Get the current numbers in the US
 */
const getCurrentUS = async () => {
  const res = await superagent.get(`${api}/v1/us/current.json`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getCurrentState
 * @description
 *  Get the current numbers in a certain US state
 */
const getCurrentState = async (state) => {
  const abbr = await getAbbreviation(state) 
  const res = await superagent.get(`${api}/v1/states/${abbr}/current.json`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getUSOnDate
 * @description
 *  Get the US numbers on a certain date
 */
const getUSOnDate = async (date) => {
  const res = await superagent.get(`${api}/v1/us/${date}.json`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getStateOnDate
 * @description
 *  Get a state's numbers on a certain date
 */
const getStateOnDate = async (state, date) => {
  const abbr = await getAbbreviation(state)
  const res = await superagent.get(`${api}/v1/states/${abbr}/${date}.json`)
  const data = JSON.parse(res.text)
  return data
}

/**
 * @function getUSDates
 * @description
 *  Get the start date and end date of the US' historical data to prevent bad http calls
 *  Data is already in order
 */
const getUSDates = async () => {
  const res = await superagent.get(`${api}/v1/us/daily.json`)
  const data = JSON.parse(res.text)
  const dates = {
    startDate: data[0].date,
    endDate: data[data.length-1].date
  }
  return dates
}

/**
 * @function getStateDates
 * @description
 *  Get the start date and end date of a state's historical data to prevent bad http calls
 *  Data is already in order
 */
const getStateDates = async (state) => {
  const abbr = await getAbbreviation(state)
  const res = await superagent.get(`${api}/v1/states/${abbr}/daily.json`)
  const data = JSON.parse(res.text)
  const dates = {
    startDate: data[0].date,
    endDate: data[data.length-1].date
  }
  return dates
}

module.exports = {
  getCurrentUS,
  getCurrentState,
  getUSOnDate,
  getStateOnDate,
  getUSDates,
  getStateDates
}