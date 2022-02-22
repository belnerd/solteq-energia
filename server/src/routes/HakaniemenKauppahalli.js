const express = require('express');
const axios = require('axios');
const router = express.Router();

// Include helper functions
const helpers = require('../helpers');

const months = [
  'Tammikuu',
  'Helmikuu',
  'Maaliskuu',
  'Huhtikuu',
  'Toukokuu',
  'Kesäkuu',
  'Heinäkuu',
  'Elokuu',
  'Syyskuu',
  'Lokakuu',
  'Marraskuu',
  'Joulukuu',
];

const baseURL =
  'https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=1000%20Hakaniemen%20kauppahalli&ReportingGroup=Electricity&';

// Transform the data to a more readable format
const transformData = (objData) => {
  let objArray = JSON.parse(JSON.stringify(objData));
  objArray.forEach((x) => {
    x.timestamp = new Date(x.timestamp).toLocaleDateString();
    x.value = x.value.toFixed(2);
  });
  return objArray;
};

// Create a CSV file from the data passed
const makeCSVLog = (data) => {
  const CSV = helpers.convertToCSV(data, true);
  const now = helpers.createDatestring(Date.now());
  const path = './logs/';
  const filename = `${path}${now}-HakaniemenKauppahalli.csv`;
  helpers.exportCSV(CSV, filename);
};

// Create a monthly HTML table from the given data
const createMonthlyTable = (data, month, year) => {
  let html = `<h3>${months[month]}</h3>`;
  let startDate = new Date();
  let endDate = new Date();
  // Set the first and last days of the month
  startDate.setFullYear(year, month, 0);
  endDate.setFullYear(year, month + 1, 0);
  // Go through the data to get data for the whole month
  let array = helpers.filterByDates(data, startDate, endDate);
  const sum = helpers.calculateSum(array, 'value');
  // Make the data more readable and then make HTML out of it
  array = transformData(array);
  html += helpers.objToHTMLTable(array);
  html += `<p class="sum">Yhteensä ${sum.toFixed(2)} kWh</p>`;
  return html;
};

// GET from API with fixed URL and parameters, then process the response
router.get('/', (req, res, next) => {
  const apiURL = baseURL + 'StartTime=2019-01-01&EndTime=2019-12-31';
  axios
    .get(apiURL)
    .then((response) => {
      let html = '';
      makeCSVLog(response.data);
      for (let i = 0; i < months.length; i++) {
        html += createMonthlyTable(response.data, i, 2019);
      }
      res.send(html);
    })
    .catch((error) => {
      res.send('Server error:' + error);
    });
});

// GET data for given range of dates from API with parameters received from the client and process the response
router.get('/range/', (req, res) => {
  let startTime = req.query.StartTime;
  let endTime = req.query.EndTime;
  if (startTime > endTime) {
    [startTime, endTime] = [endTime, startTime]
  }
  const apiURL = `${baseURL}&StartTime=${startTime}&EndTime=${endTime}`;
  axios
    .get(apiURL)
    .then((response) => {
      let html = `<h3>${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}</h3>`;
      let array = transformData(response.data);
      const sum = helpers.calculateSum(response.data, 'value');
      makeCSVLog(response.data);
      html += helpers.objToHTMLTable(array);
      html += `<p class="sum">Yhteensä ${sum.toFixed(2)} kWh</p>`;
      res.send(html);
    })
    .catch((error) => {
      res.send('Server error: ' + error);
    });
});

module.exports = router;
