
// Starting Date for world data
const startDate = `2020-03-01`

// Google Charts graph colors for consistency
const color_confirmed = `#e60000`
const color_recovered = `#00fe00`
const color_death = `#d6d6d6`

// Google Charts line chart trend options consistent across entities
const num_horizontal_ticks = 5
const trends_options = {
  width: (window.innerWidth - 50) * .60,
  height: 240,
  legend: `none`,
  backgroundColor: `#222222`,
  hAxis: {
    format: `MMM d`,
  },
  vAxis: {}
}

const countiresTableId = `countries_entities_table`

/**
 * @function fillWorldPage
 * @description
 *   Initial onload to fill the 'World' page with Covid Data
 */
const fillWorldPage = async () => {
  const worldData = await $.get(`/covidData/world/current`)
  const summary = await $.get(`/covidData/world/summary`)

  createEntity(`world_entity`, `World`, null)
  createText(`World_data_table_text_cell`, worldData)

  // Load entity and text for countries first
  const countriesTable = document.getElementById(countiresTableId)
  for(var i = 0; i < summary.length; i++) {
    const country = summary[i]

    // Create row for new entity
    const row = countriesTable.insertRow(i)

    // Create entity div to store entity
    const countryEntity = document.createElement(`div`)
    countryEntity.className = `entity`
    countryEntity.id = country.Slug + `_entity`
    row.appendChild(countryEntity)

    createEntity(country.Slug + `_entity`, country.Country)
    createText(`${country.Country}_data_table_text_cell`, country)
  }

  // Now load trends with a loading indicator
  for(var i = 0; i < summary.length; i++) {
    const country = summary[i]
    const entity = document.getElementById(country.Slug + `_entity`)

    // Crate div to store trend
    const trendDiv = document.createElement(`div`)
    trendDiv.id = `${country.Slug}_entity_trend_country`
    trendDiv.className = `entity_country_trend`
    entity.appendChild(trendDiv)

    const countryDailyData = await $.get(`/covidData/world/country/${country.Slug}/${startDate}`)
    createTrend(`${country.Country}_data_table_trend_cell`, countryDailyData)

    // Trend overlaps loader so it is destroyed

    // Add last updated date
    const lastUpdated = document.createElement(`span`)
    lastUpdated.className = `entity_last_updated`
    lastUpdated.innerHTML = `Last Updated: ${country.Date.substring(0, 10)}`
    entity.appendChild(lastUpdated)
  }
}

/**
 * @function createEntity
 * @description
 *   Create an interactive piece of covid data that includes:
 *    - title of data
 *    - Data table to store text and trend
 */
const createEntity = async (entityId, title, lastUpdatedDate) => {
  const entity = document.getElementById(entityId)

  // title
  const entityTitle = document.createElement(`span`)
  entityTitle.className = `entity_title`
  entityTitle.innerHTML = title
  entity.appendChild(entityTitle)

  // data table
  const entityTable = document.createElement(`table`)
  entityTable.className = `entity_title`
  entityTable.id = `${title}_data_table`

  const tableRow = entityTable.insertRow(0)
  tableRow.id = `${title}_data_table_row`

  // Text Cell
  const textCell = tableRow.insertCell(0)
  textCell.className = `data_table_text_cell`
  textCell.id = `${title}_data_table_text_cell`

  // Trend Cell
  if(title !== `World`) {
    const trendCell = tableRow.insertCell(1)
    trendCell.className = `data_table_trend_cell`
    trendCell.id = `${title}_data_table_trend_cell`

    // loader
    const loader = document.createElement(`div`)
    loader.className = `loader`
    loader.id = `${title}_entity_loader`
    trendCell.appendChild(loader)
  }

  entity.appendChild(entityTable)
}

/**
 * @function createText
 * @description
 *   Create a cases, mortality, testing, and hospital information as text
 */
function createText(cellId, data) {
  const textCell = document.getElementById(cellId)

  textCell.innerHTML = `
    <ul class="entity_text_list">
      <li style="color: ${color_confirmed};">Confirmed: ${data.TotalConfirmed ? numberWithCommas(data.TotalConfirmed) : 0}</li>
      <li style="color: ${color_death};">Deaths: ${data.TotalDeaths ? numberWithCommas(data.TotalDeaths) : 0}</li>
      <li style="color: ${color_recovered};">Recovered: ${data.TotalRecovered ? numberWithCommas(data.TotalRecovered) : 0}</li>
    </ul>`
}

/**
 * @function createTrend
 * @description
 *   Create a confirmed, deaths, and recovered information as text
 */
function createTrend(cellId, dailyData) {
  google.charts.load('current', {'packages': ['line', 'corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const data = new google.visualization.DataTable()
    data.addColumn('date', 'Day')
    data.addColumn('number', `Confirmed`)
    data.addColumn('number', `Deaths`)
    data.addColumn('number', `Recovered`)

    const rows = []
    var max_value = -1
    for(var i = dailyData.length - 1; i--; i >= 0) {
      const year = dailyData[i].Date.toString().substring(0, 4)
      const month = dailyData[i].Date.toString().substring(5, 7) - 1
      const day = dailyData[i].Date.toString().substring(8, 10)

      if(dailyData[i].Confirmed > max_value)
        max_value = dailyData[i].Confirmed

      if(dailyData[i].Deaths > max_value)
        max_value = dailyData[i].Deaths
      
      if(dailyData[i].Recovered > max_value)
        max_value = dailyData[i].Recovered

      rows.push([new Date(year, month, day), dailyData[i].Confirmed, dailyData[i].Deaths, dailyData[i].Recovered])
    }

    const ticks = []
    const tick_spacing = (max_value * 1.1) / num_horizontal_ticks
    for(var i = 0; i <= num_horizontal_ticks; i++) {
      ticks.push(roundUp(tick_spacing * i))
    }

    data.addRows(rows)
    var options = trends_options
    options.vAxis.ticks = ticks
    options.colors = [color_confirmed, color_death, color_recovered]

    var chart = new google.visualization.LineChart(document.getElementById(cellId))
    chart.draw(data, options)
  }
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