
// Google Charts graph colors for consistency
const color_positive = `#e60000`
const color_negative = `#00fe00`
const color_death = `#000000`
const color_recovered = `#00ff00`
const color_totalTests = `#33ccff`
const color_pending = `#ffff99`
const color_hospitalized = `#dedeff`
const color_icu = `#ffffd4`
const color_ventilator = `#fdd3d4`

// Google Charts line chart trend options consistent across entities
const num_horizontal_ticks = 5
const horizontal_axis_dates = [new Date(2020, 2), new Date(2020, 5), new Date(2020, 8)]
const trends_options = {
  width: (window.innerWidth - 50) / 4,
  height: 240,
  legend: `none`,
  backgroundColor: `#222222`,
  hAxis: {
    ticks: horizontal_axis_dates
  },
  vAxis: {}
}

const stateTableId = `states_entities_table`

/**
 * @function fillWorldPage
 * @description
 *   Initial onload to fill the 'World' page with Covid Data
 */
const fillWorldPage = async () => {
  console.log(`Fill World Page`)

  const worldData = await $.get(`/covidData/world/current`)
  console.log(`World: ${JSON.stringify(worldData)}`)

  const summary = await $.get(`/covidData/world/summary`)
  console.log(`Summary: ${JSON.stringify(summary)}`)

  const countries = await $.get(`/data/countries`)
  const countriesList = countries.data
}

/**
 * @function numberWithCommas
 * @description
 *   Fill big numbers with comma indicators
 *   https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @example
 *   1234567890 -> 1,234,567,890
 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * @function roundUp
 * @description
 *   Round up numbers depending on their size:
 *    - If number <= 1,000 then round nearest 1
 *    - If number > 1,000 then round nearest 100
 *    - If number > 10,000 then round nearest 1,000
 *    - If number > 100,000 then round nearest 10,000
 *    - If number > 1,000,000 then round nearest 100,000
 */
function roundUp(x) {

  if(x > 1000000) return Math.ceil(x/100000) * 100000
  if(x > 100000) return Math.ceil(x/10000) * 10000
  if(x > 10000) return Math.ceil(x/1000) * 1000
  if(x > 1000) return Math.ceil(x/100) * 100
  if(x <= 1000) return Math.ceil(x)
}