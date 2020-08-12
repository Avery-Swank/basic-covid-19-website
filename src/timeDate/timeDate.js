
const moment = require(`moment`)

/**
 * @function getToday
 * @description
 *  Get todays date with format: YYYYMMDD
 */
const getToday = () => {
  return moment().format(`YYYYMMDD`)
}

/**
 * @function getDaysAgo
 * @description
 *  Get date a number of days ago with format: YYYYMMDD
 */
const getDaysAgo = (numDays = 0) => {
  return moment().subtract(numDays, 'd').format(`YYYYMMDD`)
}

module.exports = {
  getToday,
  getDaysAgo
}