
const { getUSOnDate, getStateOnDate } = require(`./covidData`)

const relativeData = [`positive`, `negative`, `hospitalizedCumulative`, `inIcuCumulative`, `onVentilatorCumulative`, `recovered`, `death`, `hospitalized`, `total`]

/**
 * @function getUSDifference
 * @description
 *  Get the difference between two sets of covid data on two different dates
 *  A lot of data is ignored because comparisons are irrelevant
 */
const getUSDifference = async (beforeDate, afterDate) => {
  const beforeData = await getUSOnDate(beforeDate)
  const afterData = await getUSOnDate(afterDate)
  return await getDifference(beforeData, afterData)
}

/**
 * @function getStateDifference
 * @description
 *  Get the difference between two sets of covid data on two different dates
 *  A lot of data is ignored because comparisons are irrelevant
 */
const getStateDifference = async (beforeDate, afterDate) => {
  const beforeData = await getStateOnDate(beforeDate)
  const afterData = await getStateOnDate(afterDate)
  return await getDifference(beforeData, afterData)
}

const getDifference = async (beforeData, afterData) => {
  const diffData = {
    date: `${beforeData.date} -> ${afterData.date}`,
  }

  const dataKeys = Object.keys(beforeData)
  for(const dataKey of dataKeys) {
    try {
      const beforeDataInt = parseInt(beforeData[dataKey])
      const afterDataInt = parseInt(afterData[dataKey])
      if(relativeData.includes(dataKey)) {
        diffData[dataKey] = afterDataInt - beforeDataInt
      }
    } catch (e) {}
  }
  return diffData
}

module.exports = {
  getUSDifference,
  getStateDifference
}