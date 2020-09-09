
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
 * @function fillUSPage
 * @description
 *   Initial onload to fill the 'United States' page with Covid Data
 */
const fillUSPage = async () => {
    const usData = await $.get(`/covidData/united-states/us`)
    const usDailyData = await $.get(`/covidData/united-states/us/daily`)

    const states = await $.get(`/covidData/united-states/states`)
    const statesInfo = await $.get(`/data/states`)

    // Create United States entity
    createEntity(`us_entity`, `United States`, usData.lastModified.substring(0, 10))
    createTexts(`us_entity`, usData)
    createTrends(`us_entity`, usDailyData)

    // Create each indiviaul state's entity and text
    const statesTable = document.getElementById(stateTableId)
    for(var i = 0; i < states.length - 1; i++) {
      const stateData = states[i]
      var stateName
      var stateAbbr

      for(const stateInfo of statesInfo.data) {
        if(stateInfo.abbreviation === states[i].state) {
          stateName = stateInfo.name
          stateAbbr = stateInfo.abbreviation
        }
      }

      // Create row for new entity
      const numRows = statesTable.getElementsByTagName(`tr`)
      const row = statesTable.insertRow(i)

      // Create entity div to store entity
      const stateEntity = document.createElement(`div`)
      stateEntity.className = `entity`
      stateEntity.id = stateAbbr + `_entity`
      row.appendChild(stateEntity)

      createEntity(stateEntity.id, stateName, stateData.dateModified.substring(0, 10))
      createTexts(stateEntity.id, stateData)
    }

    // Because it takes a lot longer to generate trends
    // Create each indiviaul state's trends after generating
    // a descent amount of information
    for(var i = 0; i < states.length; i++) {
      var stateName
      var stateAbbr

      for(const stateInfo of statesInfo.data) {
        if(stateInfo.abbreviation === states[i].state) {
          stateName = stateInfo.name
          stateAbbr = stateInfo.abbreviation
        }
      }

      const stateDailyData = await $.get(`/covidData/united-states/${stateAbbr}/daily`)

      createTrends(`${stateAbbr}_entity`, stateDailyData)
    }
}

/**
 * @function createEntity
 * @description
 *   Create an interactive piece of covid data that includes:
 *    - title of data
 *    - a set of texts pertaining to cases, hospitalizations, deaths, etc.
 *    - a set of historical trends pertaining to cases, hospitalizations, deaths, etc.
 *    - a standard loader
 */
const createEntity = async (entityId, title, lastUpdatedDate) => {
  const entity = document.getElementById(entityId)

  // title
  const entityTitle = document.createElement(`span`)
  entityTitle.className = `entity_title`
  entityTitle.innerHTML = title
  entity.appendChild(entityTitle)

  // text table
  const textTable = document.createElement(`table`)
  textTable.className = `entity_text_table`
  textTable.id = `${entityId}_text_table`
  entity.appendChild(textTable)

  // loader table
  const loaderTable = document.createElement(`table`)
  loaderTable.className = `entity_loader_table`
  loaderTable.id = `${entityId}_loader_table`
  entity.appendChild(loaderTable)

  // loaders
  const row = loaderTable.insertRow(0)
  for(var i = 0; i < 4; i++) {
    const loaderCell = row.insertCell(i)
    const loader = document.createElement(`div`)
    loader.className = `loader`
    loader.id = `${entityId}_loader_${i}`
    loaderCell.appendChild(loader)
  }

  // historical table
  const historicalTable = document.createElement(`table`)
  historicalTable.className = `entity_trend_table`
  historicalTable.id = `${entityId}_trend_table`
  entity.appendChild(historicalTable)

  // last updated
  const lastUpdated = document.createElement(`span`)
  lastUpdated.className = `entity_last_updated`
  lastUpdated.innerHTML = `Last Updated: ${lastUpdatedDate}`
  entity.appendChild(lastUpdated)
}

/**
 * @function createTexts
 * @description
 *   Create a cases, mortality, testing, and hospital information as text
 */
function createTexts(entityId, data) {
  const table = document.getElementById(`${entityId}_text_table`)
  const row = table.insertRow(0)

  var casesCell = row.insertCell(0)
  var mortalityCell = row.insertCell(1)
  var testingCell = row.insertCell(2)
  var hospitalCell = row.insertCell(3)

  casesCell.innerHTML = `
    <ul class="entity_text_list">
      <li style="color: ${color_positive};">Positive: ${data.positive ? numberWithCommas(data.positive) : 0}</li>
      <li style="color: ${color_negative};">Negative: ${data.negative ? numberWithCommas(data.negative) : 0}</li>
    </ul>`

  mortalityCell.innerHTML = `
    <ul class="entity_text_list">
      <li style="color: ${color_death};">Deaths: ${data.death ? numberWithCommas(data.death) : 0}</li>
      <li style="color: ${color_recovered};">Recovered: ${data.recovered ? numberWithCommas(data.recovered) : 0}</li>
    </ul>`

  testingCell.innerHTML = `
    <ul class="entity_text_list">
      <li style="color: ${color_totalTests};">Total Tests: ${data.totalTestResults ? numberWithCommas(data.totalTestResults) : 0}</li>
      <li style="color: ${color_pending};">Pending: ${data.pending ? numberWithCommas(data.pending) : 0}</li>
    </ul>`

  hospitalCell.innerHTML = `
    <ul class="entity_text_list">
      <li style="color: ${color_hospitalized};">Hospitalized: ${data.hospitalizedCurrently ? numberWithCommas(data.hospitalizedCurrently) : 0}</li>
      <li style="color: ${color_icu};">ICU: ${data.inIcuCurrently ? numberWithCommas(data.inIcuCurrently) : 0}</li>
      <li style="color: ${color_ventilator};">On Ventilator: ${data.onVentilatorCurrently ? numberWithCommas(data.onVentilatorCurrently) : 0}</li>
    </ul>`
}

/**
 * @function createTrends
 * @description
 *   Create a cases, mortality, testing, and hospital information as a historical trend
 */
function createTrends(entityId, data) {
  const table = document.getElementById(`${entityId}_trend_table`)
  const row = table.insertRow(0)

  const casesCell = row.insertCell(0)
  casesCell.id = entityId + `_trend_cases`
  createCasesTrend(casesCell.id, data)

  const mortalityCell = row.insertCell(1)
  mortalityCell.id = entityId + `_trend_mortality`
  createMortalityTrend(mortalityCell.id, data)

  const testingCell = row.insertCell(2)
  testingCell.id = entityId + `_trend_testing`
  createTestingTrend(testingCell.id, data)

  const hospitalCell = row.insertCell(3)
  hospitalCell.id = entityId + `_trend_hospital`
  createHospitalTrend(hospitalCell.id, data)

  // Finished loading so hide entity loader
  for(var i = 0; i < 4; i++) {
    const loader = document.getElementById(`${entityId}_loader_${i}`)
    loader.hidden = true
  }
}

/**
 * @function createCasesTrend
 * @description
 *   Create a line chart trend with 'positive' and 'negative' data
 */
function createCasesTrend(elementId, dailyData) {
  google.charts.load('current', {'packages': ['line', 'corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const data = new google.visualization.DataTable()
    data.addColumn('date', 'Day')
    data.addColumn('number', `Positive`)
    data.addColumn('number', `Negative`)

    const rows = []
    var max_value = -1
    for(var i = dailyData.length - 1; i--; i >= 0) {
      const year = dailyData[i].date.toString().substring(0, 4)
      const month = dailyData[i].date.toString().substring(4, 6)
      const day = dailyData[i].date.toString().substring(6, 8)

      if(dailyData[i].positive > max_value)
        max_value = dailyData[i].positive
      
      if(dailyData[i].negative > max_value)
        max_value = dailyData[i].negative

      rows.push([new Date(year, month, day), dailyData[i].positive, dailyData[i].negative])
    }

    const ticks = []
    const tick_spacing = (max_value * 1.1) / num_horizontal_ticks
    for(var i = 0; i <= num_horizontal_ticks; i++) {
      ticks.push(roundUp(tick_spacing * i))
    }

    data.addRows(rows)
    var options = trends_options
    options.vAxis.ticks = ticks
    options.colors = [color_positive, color_negative]

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
    chart.draw(data, options)
  }
}

/**
 * @function createMortalityTrend
 * @description
 *   Create a line chart trend with 'death' and 'recovered' data
 */
function createMortalityTrend(elementId, dailyData) {
  google.charts.load('current', {'packages': ['line', 'corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const data = new google.visualization.DataTable()
    data.addColumn('date', 'Day');
    data.addColumn('number', `Deaths`);
    data.addColumn('number', `Recovered`)

    const rows = []
    var max_value = -1
    for(var i = dailyData.length - 1; i--; i >= 0) {
      const year = dailyData[i].date.toString().substring(0, 4)
      const month = dailyData[i].date.toString().substring(4, 6)
      const day = dailyData[i].date.toString().substring(6, 8)

      if(dailyData[i].death > max_value)
        max_value = dailyData[i].death
      
      if(dailyData[i].recovered > max_value)
        max_value = dailyData[i].recovered

      rows.push([new Date(year, month, day), dailyData[i].death, dailyData[i].recovered])
    }

    const ticks = []
    const tick_spacing = (max_value * 1.1) / num_horizontal_ticks
    for(var i = 0; i <= num_horizontal_ticks; i++) {
      ticks.push(roundUp(tick_spacing * i))
    }

    data.addRows(rows)
    var options = trends_options
    options.vAxis.ticks = ticks
    options.colors = [color_death, color_recovered]

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
    chart.draw(data, options)
  }
}

/**
 * @function createTestingTrend
 * @description
 *   Create a line chart trend with 'totalTests' and 'pending' data
 */
function createTestingTrend(elementId, dailyData) {
  google.charts.load('current', {'packages': ['line', 'corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const data = new google.visualization.DataTable()
    data.addColumn('date', 'Day');
    data.addColumn('number', `Tests Performed`);
    data.addColumn('number', `Pending`)

    const rows = []
    var max_value = -1
    for(var i = dailyData.length - 1; i--; i >= 0) {
      const year = dailyData[i].date.toString().substring(0, 4)
      const month = dailyData[i].date.toString().substring(4, 6)
      const day = dailyData[i].date.toString().substring(6, 8)

      if(dailyData[i].totalTestResults > max_value)
        max_value = dailyData[i].totalTestResults
      
      if(dailyData[i].pending > max_value)
        max_value = dailyData[i].pending

      rows.push([new Date(year, month, day), dailyData[i].totalTestResults, dailyData[i].pending])
    }

    const ticks = []
    const tick_spacing = (max_value * 1.1) / num_horizontal_ticks
    for(var i = 0; i <= num_horizontal_ticks; i++) {
      ticks.push(roundUp(tick_spacing * i))
    }

    data.addRows(rows)
    var options = trends_options
    options.vAxis.ticks = ticks
    options.colors = [color_totalTests, color_pending]

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
    chart.draw(data, options)
  }
}

/**
 * @function createHospitalTrend
 * @description
 *   Create a line chart trend with 'hospitalized' and 'icu' and 'ventilator' data
 */
function createHospitalTrend(elementId, dailyData) {
  google.charts.load('current', {'packages': ['line', 'corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const data = new google.visualization.DataTable()
    data.addColumn('date', 'Day');
    data.addColumn('number', `Hospitalized`);
    data.addColumn('number', `ICU`)
    data.addColumn('number', `On Ventilator`)

    const rows = []
    var max_value = -1
    for(var i = dailyData.length - 1; i--; i >= 0) {
      const year = dailyData[i].date.toString().substring(0, 4)
      const month = dailyData[i].date.toString().substring(4, 6)
      const day = dailyData[i].date.toString().substring(6, 8)

      if(dailyData[i].hospitalizedCurrently > max_value)
        max_value = dailyData[i].hospitalizedCurrently
      
      if(dailyData[i].inIcuCurrently > max_value)
        max_value = dailyData[i].inIcuCurrently

      if(dailyData[i].onVentilatorCurrently > max_value)
        max_value = dailyData[i].onVentilatorCurrently

      rows.push([new Date(year, month, day), dailyData[i].hospitalizedCurrently, dailyData[i].inIcuCurrently, dailyData[i].onVentilatorCurrently])
    }

    const ticks = []
    const tick_spacing = (max_value * 1.1) / num_horizontal_ticks
    for(var i = 0; i <= num_horizontal_ticks; i++) {
      ticks.push(roundUp(tick_spacing * i))
    }

    data.addRows(rows)
    var options = trends_options
    options.vAxis.ticks = ticks
    options.colors = [color_hospitalized, color_icu, color_ventilator]

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
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