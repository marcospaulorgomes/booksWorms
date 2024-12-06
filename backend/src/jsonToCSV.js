import fs from 'fs';

export function jsonToCSV(json) {
  try {
    const convertJSONToCSV = json => {
      const header = Object.keys(json[0]).join(',');
      const rows = json.map(obj =>
        Object.values(obj).join(',')
      ).join('\n');
      return header + "\n" + rows;
    };

    const folderPath = '';
    const fileName = 'query_response.csv';
    const fileContent = convertJSONToCSV(json);

    const path = folderPath + fileName;

    fs.writeFile(path, fileContent, (err) => {
      if (err) {
        throw err;
      }
    });

  } catch (error) {
    return "Error " + error.toString();
  }
}