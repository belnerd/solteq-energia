const express = require('express');
const axios = require('axios');
const router = express.Router();

// Include helper functions
const helpers = require('../helpers');


const transformData = (obj) => {
  let objArray = obj
  objArray.forEach(x => {
    x.timestamp = new Date(x.timestamp).toLocaleDateString()
  })
  return objArray
};

const makeCSVLog = (data) => {
  const CSV = helpers.convertToCSV(data, true);
  const now = helpers.createDatestring(Date.now());
  const path = './logs/';
  const filename = `${path}${now}-HakaniemenKauppahalli.csv`;
  helpers.exportCSV(CSV, filename);
};

const getMonthlyData = (obj, month) => {};

// GET from API with fixed URL and parameters, then process the response
router.get('/', (req, res, next) => {
  const apiURL =
    'https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=1000%20Hakaniemen%20kauppahalli&ReportingGroup=Electricity&StartTime=2019-01-01&EndTime=2019-12-31';
  axios
    .get(apiURL)
    .then((response) => {
      //   makeCSVLog(response.data);
      // let values = Object.values(response.data[0]);
      // let date = new Date(values[0]);
      // console.log(date.toLocaleDateString('fi-FI'));
      // getMonthlyData(response.data, 1);
      let data = transformData(response.data);
      let headers = ['aika','ryhmä','paikka','kulutus','yksikkö']
      const html = helpers.objToHTMLTable(data, headers);
      res.send(html);
    })
    .catch((error) => {
      res.send('Server error:' + error);
    });
});

module.exports = router;
