
const usTableId = `usTable`
const stateTableId = `states_entities_table`

// Google Charts graph options consistent across the page
const piechart_options = {
  width: 400,
  height: 240,
  pieHole: 0.7,
  legend: `none`,
  backgroundColor: `#222222`,
  pieSliceText: `none`,
}

const trends_options = {
  width: 300,
  height: 180,
  legend: `none`,
  backgroundColor: `#222222`,
  hAxis: {
    ticks: [new Date(2014, 0), new Date(2014, 1), new Date(2014, 2), new Date(2014, 3),
            new Date(2014, 4),  new Date(2014, 5), new Date(2014, 6), new Date(2014, 7),
            new Date(2014, 8), new Date(2014, 9), new Date(2014, 10), new Date(2014, 11)]
  }
}

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

/**
 * @function fillTables
 * @description
 *   Initial onload to fill the page with Covid Data
 */
const fillTables = async () => {
    const us = await $.get(`/covidData/us`)
    const states = await $.get(`/covidData/states`)
    const statesInfo = await $.get(`/data/states`)

    // Create United States entity
    const usData = us[0]
    createEntity(`us_entity`, `United States`, usData.lastModified.substring(0, 10))
    createTexts(`us_entity`, usData)
    createGraphs(`us_entity`, usData)
    createTrends(`us_entity`, usData)

    // Create each indiviaul state's entity
    const statesTable = document.getElementById(stateTableId)
    for(var i = states.length-1; i >= 0; i--) {
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
      const row = statesTable.insertRow(numRows)

      // Create entity div to store entity
      const stateEntity = document.createElement(`div`)
      stateEntity.className = `entity`
      stateEntity.id = stateAbbr + `_entity`
      row.appendChild(stateEntity)

      createEntity(stateEntity.id, stateName, stateData.dateModified.substring(0, 10))
      createTexts(stateEntity.id, stateData)
      createGraphs(stateEntity.id, stateData)
      createTrends(stateEntity.id, stateData)
    }
}

/**
 * @function createEntity
 * @description
 *   Create an interactive piece of covid data that includes:
 *    - title of data
 *    - a set of texts pertaining to cases, hospitalizations, deaths, etc.
 *    - a set of graphs pertaining to cases, hospitalizations, deaths, etc.
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

  // loading animation
  const loader = document.createElement(`div`)
  loader.className = `loader`
  loader.id = `${entityId}_loader`
  loader.hidden = false
  entity.appendChild(loader)

  // graph table
  const graphTable = document.createElement(`table`)
  graphTable.className = `entity_graph_table`
  graphTable.id = `${entityId}_graph_table`
  graphTable.hidden = true
  entity.appendChild(graphTable)

  // historical table
  const historicalTable = document.createElement(`table`)
  historicalTable.className = `entity_trend_table`
  historicalTable.id = `${entityId}_trend_table`
  historicalTable.hidden = true
  entity.appendChild(historicalTable)

  // last updated
  const lastUpdated = document.createElement(`span`)
  lastUpdated.className = `entity_last_updated`
  lastUpdated.innerHTML = `Last Updated: ${lastUpdatedDate}`
  entity.appendChild(lastUpdated)
}

/**
 * @function createGraphs
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
 * @function createGraphs
 * @description
 *   Create a cases, mortality, testing, and hospital information as pie charts
 */
function createGraphs(entityId, data) {
  const table = document.getElementById(`${entityId}_graph_table`)
  const row = table.insertRow(0)

  const casesCell = row.insertCell(0)
  casesCell.className = `entity_graph`
  casesCell.id = entityId + `_graph_cases`
  createCasesGraph(casesCell.id, data)

  const mortalityCell = row.insertCell(1)
  mortalityCell.className = `entity_graph`
  mortalityCell.id = entityId + `_graph_mortality`
  createMortalityGraph(mortalityCell.id, data)

  const testingCell = row.insertCell(2)
  testingCell.className = `entity_graph`
  testingCell.id = entityId + `_graph_testing`
  createTestingGraph(testingCell.id, data)

  const hospitalCell = row.insertCell(3)
  hospitalCell.className = `entity_graph`
  hospitalCell.id = entityId + `_graph_hospital`
  createHospitalGraph(hospitalCell.id, data)
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
  //createMortalityGraph(mortalityCell.id, data)

  const testingCell = row.insertCell(2)
  testingCell.id = entityId + `_trend_testing`
  //createTestingGraph(testingCell.id, data)

  const hospitalCell = row.insertCell(3)
  hospitalCell.id = entityId + `_trend_hospital`
  //createHospitalGraph(hospitalCell.id, data)
}

/**
 * @function createCasesGraph
 * @description
 *   Create a pie chart with case data: 'positive' and 'negative'
 */
function createCasesGraph(elementId, data) {
  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const chartData = google.visualization.arrayToDataTable([
      ['Case Type', 'Number of Cases'],
      ['Positive', data.positive],
      ['Negative', data.negative],
    ])

    const options = piechart_options
    options.colors = [color_positive, color_negative]
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options)
  }
}

/**
 * @function createMortalityGraph
 * @description
 *   Create a pie chart with mortality data: 'death' and 'recovered'
 */
function createMortalityGraph(elementId, data) {
  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const chartData = google.visualization.arrayToDataTable([
      ['Outcome Type', 'Outcome Count'],
      ['Deaths', data.death],
      ['Recovered', data.recovered],
    ])

    const options = piechart_options
    options.colors = [color_death, color_recovered]
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options)
  }
}

/**
 * @function createTestingGraph
 * @description
 *   Create a pie chart with testing data: 'death' and 'recovered'
 */
function createTestingGraph(elementId, data) {
  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const chartData = google.visualization.arrayToDataTable([
      ['Testing Type', 'Testing Count'],
      ['Tests Performed', data.totalTestResults],
      ['Tests Pending', data.pending],
    ])

    const options = piechart_options
    options.colors = [color_totalTests, color_pending]
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options)
  }
}

/**
 * @function createHospitalGraph
 * @description
 *   Create a pie chart with hospital 'currently' data: 'hospitalizedCurrently', 'inIcuCurrently', and 'onVentilatorCurrently'
 */
function createHospitalGraph(elementId, data) {
  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    const chartData = google.visualization.arrayToDataTable([
      ['Hospital State', 'Count'],
      ['Hospitalized', data.hospitalizedCurrently],
      ['ICU', data.inIcuCurrently],
      ['On Ventilator', data.onVentilatorCurrently],
    ])

    const options = piechart_options
    options.colors = [color_hospitalized, color_icu, color_ventilator]

    // Disable all loaders
    const loaders = document.getElementsByClassName(`loader`)
    for(const loader of loaders) {
      loader.hidden = true
    }
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options)
  }
}

/**
 * @function createCasesTrend
 * @description
 *   Create a line chart trend with positive and negative data
 */
function createCasesTrend(elementId, data) {
  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Month', 'Sales', 'Expenses'],
      ['Feb',  1000,      400],
      ['Mar',  1170,      460],
      ['Apr',  660,       1120],
      ['May',  1030,      540],
      ['Jun',  1030,      540],
      ['Jul',  1030,      540],
      ['Aug',  1030,      540]
    ])

    var options = trends_options

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
    chart.draw(data, options)
  }
}

/**
 * @function filterData
 * @description
 *   Hide/Show only the selected data display types: text, graph, historical
 */
function filterData(filter, checkbox) {
  const textTables = document.getElementsByClassName(`entity_text_table`)
  const graphTables = document.getElementsByClassName(`entity_graph_table`)
  const historicalTables = document.getElementsByClassName(`entity_trend_table`)

  switch(filter) {
    case 'text':
      for(const textTable of textTables)
        textTable.hidden = !checkbox.checked
    break
    case 'graph':
      for(const graphTable of graphTables)
        graphTable.hidden = !checkbox.checked
    break
    case 'historical':
      for(const historicalTable of historicalTables)
        historicalTable.hidden = !checkbox.checked
    break
  }
}

/**
 * @function numberWithCommas
 * @description
 *   Fill big numbers with comma indicators
 *   https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}