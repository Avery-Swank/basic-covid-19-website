
const moment = require(`moment`)
const states = require(`./states.json`)

/**
 * @function getState
 * @description
 *  Get the state name associated with the state abbreviation
 */
const getState = (abbr) => {
  for(const stateIter of states.data) {
    if(stateIter.abbreviation.toLowerCase() === abbr.toLowerCase()) {
      return stateIter.name
    }
  }
  return ``
}

/**
 * @function getStates
 * @description
 *  Get all states in order
 */
const getStates = () => {
  const states = []
  for(const stateIter of states.data) {
    states.push(stateIter.name)
  }
  return states
}

/**
 * @function getAbbreviation
 * @description
 *  Get the state abbreviation associated with the state name
 */
const getAbbreviation = (name) => {
  for(const stateIter of states.data) {
    if(stateIter.name.toLowerCase() === name.toLowerCase()) {
      return stateIter.abbreviation
    }
  }
  return ``
}

module.exports = {
  getState,
  getStates,
  getAbbreviation
}