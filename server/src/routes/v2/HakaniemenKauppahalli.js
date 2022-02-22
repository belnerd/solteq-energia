// Version 2.0 - Use classes

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Include helper functions
const helpers = require('../../helpers');

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

class EnergyData {
  constructor(timestamp, reportingGroup, locationName, value, unit) {
    this.timestamp = new Date(timestamp);
    this.reportingGroup = reportingGroup;
    this.locationName = locationName;
    this.value = value;
    this.unit = unit;

    // Return formatted object with more readable date and value
    this.getFormatted = function () {
      return {
        time: this.timestamp.toLocaleDateString(),
        repotingGroup: this.reportingGroup,
        locationName: this.locationName,
        value: this.value.toFixed(2),
        unit: this.unit,
      };
    };

    // Check if given month and year are equal to current object's date
    this.checkMonthAndYear = function (month, year) {
      if (
        this.timestamp.getMonth() === month &&
        this.timestamp.getFullYear() === year
      ) {
        return true;
      } else {
        return false;
      }
    };
  }
}

// Create a monthly HTML table from the given data
const createMonthlyTable = (data, month, year) => {
    let html = `<h3>${months[month]}</h3>`;
    let array = []
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].checkMonthAndYear(month, year)) {
            array.push(data[i].getFormatted())
            sum += data[i].value
        }
    }
    // console.log(sum)
    html += helpers.objToHTMLTable(array)
    html += `<p class="sum">Yhteensä ${sum.toFixed(2)} kWh</p>`;
    return html;
  };

const baseURL =
  'https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=1000%20Hakaniemen%20kauppahalli&ReportingGroup=Electricity&';

router.get('/', (req, res) => {
  const apiURL = baseURL + 'StartTime=2019-01-01&EndTime=2019-12-31';
  let energyData = [];
  axios
    .get(apiURL)
    .then((response) => {
      data = response.data;
      for (let i in data) {
        energyData.push(
          new EnergyData(
            data[i].timestamp,
            data[i].reportingGroup,
            data[i].locationName,
            data[i].value,
            data[i].unit
          )
        );
      }
    })
    .then(() => {
        let html = '';
        for (let i = 0; i < months.length; i++) {
          html += createMonthlyTable(energyData, i, 2019);
        }
        res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
