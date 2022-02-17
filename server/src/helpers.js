const { time } = require('console');

module.exports = {
  // Convert passed object to CSV
  convertToCSV: (obj, header) => {
    // Make sure obj is indeed an object
    let array = typeof obj != 'object' ? JSON.parse(obj) : obj;
    let str = '';
    // If true, store the headers at the beginning
    if (header) {
      str += Object.keys(obj[0]) + '\r\n';
    }
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ',';
        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  },

  // CSV file export function
  exportCSV(csvData, filename) {
    const fs = require('fs');
    fs.writeFile(filename, csvData, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(filename + ' written successfully.');
    });
  },

  // Create a datestring in the form DD-MM-YYY-HHMMSS
  createDatestring(time) {
    const timestamp = new Date(time);
    const day = ('0' + timestamp.getDate()).slice(-2);
    const month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
    const year = timestamp.getFullYear();
    const hours = ('0' + timestamp.getHours()).slice(-2);
    const minutes = ('0' + timestamp.getMinutes()).slice(-2);
    const seconds = ('0' + timestamp.getSeconds()).slice(-2);
    return `${day}-${month}-${year}-${hours}${minutes}${seconds}`;
  },

  // Create a HTML table out of provided object
  objToHTMLTable(obj, headers = false) {
    // Make sure obj is indeed an object
    let array = typeof obj != 'object' ? JSON.parse(obj) : obj;
    let html = '<table><tbody id="tbody"><tr>';
    // Add table headers
    if (!headers) {
      const keys = Object.keys(array[0]);
    } else {
      const keys = [...headers];
    }

    for (let i = 0; i < keys.length; i++) {
      html += `<th>${keys[i]}</th>`;
    }
    html += '</tr>';

    // Add table contents
    for (let i = 0; i < array.length; i++) {
      html += '<tr>';
      let row = Object.values(array[i]);
      for (let j = 0; j < row.length; j++) {
        html += `<td>${row[j]}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  },
};
