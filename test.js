

const { getUSDifference } = require(`./src/covidData/analysis`)

const main = async () => {
    const data = await getUSDifference(`20200212`, `20200216`)
    console.log(data)
}

Promise.all([main])

main()