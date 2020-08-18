
const usTableId = `usTable`
const stateTableId = `states_entities_table`

// Google Charts graph options consistent across the page
const graph_width = 300
const graph_height = 180
const graph_piehole = 0.7
const graph_legend = `none`

// Google Charts graph colors for consistency
const color_positive = `#ff0000`
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
    const usData = us[0]
    const states = await $.get(`/covidData/states`)
    const statesInfo = await $.get(`/data/states`)

    const statesTable = document.getElementById(stateTableId)

    // Create United States entity
    createEntity(`us_entity`, `United States`, usData)
    createTexts(`us_entity`, usData)
    createGraphs(`us_entity`, usData)

    // Create each indiviaul state's entity
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

      createEntity(stateEntity.id, stateName)
      createTexts(stateEntity.id, stateData)
      createGraphs(stateEntity.id, stateData)
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
const createEntity = async (entityId, title) => {
  const entity = document.getElementById(entityId)

  // title
  const entityTitle = document.createElement(`h1`)
  entityTitle.className = `entity_title`
  entityTitle.innerHTML = title
  entity.appendChild(entityTitle)

  // loading animation
  const loader = document.createElement(`div`)
  loader.className = `loader`
  loader.id = `${entityId}_loader`
  loader.hidden = false
  entity.appendChild(loader)

  // text table
  const textTable = document.createElement(`table`)
  textTable.className = `entity_text_table`
  textTable.id = `${entityId}_text_table`
  entity.appendChild(textTable)

  // graph table
  const graphTable = document.createElement(`table`)
  graphTable.className = `entity_graph_table`
  graphTable.id = `${entityId}_graph_table`
  entity.appendChild(graphTable)

  // historical table
  const historicalTable = document.createElement(`table`)
  historicalTable.className = `entity_historical_table`
  historicalTable.id = `${entityId}_historical_table`
  entity.appendChild(historicalTable)
}

function createTexts(entityId, data) {
  const table = document.getElementById(`${entityId}_text_table`)
  const row = table.insertRow(0)

  var casesCell = row.insertCell(0)
  var mortalityCell = row.insertCell(1)
  var testingCell = row.insertCell(2)
  var hospitalCell = row.insertCell(3)

  casesCell.innerHTML = `Positive: ${data.positive} Negative: ${data.negative}`
  mortalityCell.innerHTML = `Deaths: ${data.death} Recovered: ${data.recovered}`
  testingCell.innerHTML = `Total Results: ${data.totalTestResults} Pending: ${data.pending}`
  hospitalCell.innerHTML = `Hospitalized: ${data.hospitalizedCurrently} ICU: ${data.inIcuCurrently} On Ventilator: ${data.onVentilatorCurrently}`
}

function createGraphs(entityId, data) {
  const table = document.getElementById(`${entityId}_graph_table`)
  const row = table.insertRow(0)

  const casesCell = row.insertCell(0)
  casesCell.id = entityId + `_cases`
  createCasesGraph(casesCell.id, data)

  const mortalityCell = row.insertCell(1)
  mortalityCell.id = entityId + `_mortality`
  createMortalityGraph(mortalityCell.id, data)

  const testingCell = row.insertCell(2)
  testingCell.id = entityId + `_testing`
  createTestingGraph(testingCell.id, data)

  const hospitalCell = row.insertCell(3)
  hospitalCell.id = entityId + `_hospital`
  createHospitalGraph(hospitalCell.id, data)
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

    const options = {
      title: 'Cases',
      width: graph_width,
      height: graph_height,
      pieHole: graph_piehole,
      legend: graph_legend,
      colors: [color_positive, color_negative]
    }
      
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

    const options = {
      title: 'Mortality',
      width: graph_width,
      height: graph_height,
      pieHole: graph_piehole,
      legend: graph_legend,
      colors: [color_death, color_recovered]
    }
      
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

    const options = {
      title: 'Testing',
      width: graph_width,
      height: graph_height,
      pieHole: graph_piehole,
      legend: graph_legend,
      colors: [color_totalTests, color_pending]
    }
      
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
      ['Hospital State', 'Testing Count'],
      ['Hospitalized', data.hospitalizedCurrently],
      ['ICU', data.inIcuCurrently],
      ['On Ventilator', data.onVentilatorCurrently],
    ])

    const options = {
      title: 'Hospital Numbers',
      width: graph_width,
      height: graph_height,
      pieHole: graph_piehole,
      legend: graph_legend,
      colors: [color_hospitalized, color_icu, color_ventilator]
    }

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
 * @function filterData
 * @description
 *   Hide/Show only the selected data display types: text, graph, historical
 */
function filterData(filter) {
  const textTables = document.getElementsByClassName(`entity_text_table`)
  const graphTables = document.getElementsByClassName(`entity_graph_table`)
  const historicalTables = document.getElementsByClassName(`entity_historical_table`)

  switch(filter) {
    case 'text':
      for(const textTable of textTables)
        textTable.hidden = false
      for(const graphTable of graphTables)
        graphTable.hidden = true
      for(const historicalTable of historicalTables)
        historicalTable.hidden = true
    break
    case 'graph':
      for(const textTable of textTables)
        textTable.hidden = true
      for(const graphTable of graphTables)
        graphTable.hidden = false
      for(const historicalTable of historicalTables)
        historicalTable.hidden = true
    break
    case 'historical':
      for(const textTable of textTables)
        textTable.hidden = true
      for(const graphTable of graphTables)
        graphTable.hidden = true
      for(const historicalTable of historicalTables)
        historicalTable.hidden = false
    break
  }
}