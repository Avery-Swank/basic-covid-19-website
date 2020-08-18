
const usTableId = `usTable`
const stateTableId = `states_entities_table`

// Google Charts graph options consistent across the page
const graph_width = 300
const graph_height = 180
const graph_piehole = 0.7
const graph_legend = `none`

/**
 * @function fillTables
 * @description
 *   Initial onload to fill the page with Covid Data
 */
const fillTables = async () => {
    const us = await $.get(`/covidData/us`)
    const states = await $.get(`/covidData/states`)
    const statesInfo = await $.get(`/data/states`)

    const statesTable = document.getElementById(stateTableId)

    // Create United States entity
    createEntity(`us_entity`, `United States`, us[0])

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

      // Create entity div to store
      const stateEntity = document.createElement(`div`)
      stateEntity.className = `entity`
      stateEntity.id = stateAbbr + `_entity`
      row.appendChild(stateEntity)

      createEntity(stateEntity.id, stateName, stateData)
    }
}

/**
 * @function createEntity
 * @description
 *   Create an interactive piece of covid data that includes:
 *    - title of data
 *    - a set of graphs pertaining to cases, hospitalizations, deaths, etc.
 */
const createEntity = (entityId, title, data) => {
  const entity = document.getElementById(entityId)

  const entityTitle = document.createElement(`h1`)
  entityTitle.className = `entity_title`
  entityTitle.innerHTML = title
  entity.appendChild(entityTitle)

  const graphTable = document.createElement(`table`)
  graphTable.className = `entity_table`
  graphTable.id = `${entityId}_graph_table`
  entity.appendChild(graphTable)

  createGraphs(entityId, data)
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

/*function createRow(table, stateName = ``, stateData = {}) {
  const numRows = table.getElementsByTagName(`tr`)
  const row = table.insertRow(numRows.length)

  var infoCell = row.insertCell(0)
  var casesCell = row.insertCell(1)
  var mortalityCell = row.insertCell(2)
  var testingCell = row.insertCell(3)
  var hospitalCell = row.insertCell(4)

  infoCell.innerHTML = stateName
  casesCell.innerHTML = `Positive: ${stateData.positive} Negative: ${stateData.negative}`
  mortalityCell.innerHTML = `Deaths: ${stateData.death} Recovered: ${stateData.recovered}`
  testingCell.innerHTML = `Total Results: ${stateData.totalTestResults} Pending: ${stateData.pending}`
  hospitalCell.innerHTML = `Hospitalized: ${stateData.hospitalizedCurrently} ICU: ${stateData.inIcuCurrently} On Ventilator: ${stateData.onVentilatorCurrently}`
}*/

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
      colors: ['#ff0000', '#00fe00']  // Red, Green
    }
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options);
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
      colors: ['#000000', '#00ff00']  // Black, Green
    }
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options);
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
      colors: ['#33ccff', '#ffff99']  // Sky Blue, Light Yellow
    }
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options);
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
      colors: ['#dedeff', '#ffffd4', '#fdd3d4']  // Light Blue, Light Yellow, Light Red
    }
      
    const chart = new google.visualization.PieChart(document.getElementById(elementId))
    chart.draw(chartData, options);
  }
}