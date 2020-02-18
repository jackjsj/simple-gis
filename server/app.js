const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParse = require('cookie-parser');
const app = express();
const mysql = require('mysql');
app.use(cors()).use(cookieParse());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const dataFile = 'flyovers.json';
const useFile = true;
function writeJSON(json) {
  fs.writeFile(dataFile, JSON.stringify(json), function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

function readJSON() {
  const data = fs.readFileSync(dataFile);
  return JSON.parse(data.toString());
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'flyover_gis',
});

connection.connect();

// 获取点位
app.get('/points', (req, res) => {
  if (useFile) {
    // 从文件中读取点位数据
    res.send(readJSON());
  } else {
    // 从数据库中获取点位数据
    connection.query('SELECT * FROM FLYOVERS', function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      writeJSON(results);
      res.send(results);
    });
  }
});

app.post('/point/edit', (req, res) => {
  if (useFile) {
    const { body } = req;
    const { id } = body;
    const data = readJSON();
    const targetIndex = data.findIndex((item) => item.id === id);
    const target = data[targetIndex];
    Object.assign(target, body);
    // 修改flyovers.json
    writeJSON(data);
    res.status(200).end();
  } else {
    const { body } = req;
    let modSql = `UPDATE FLYOVERS SET `;
    const modSqlParams = [];
    Object.keys(body).forEach((key, index) => {
      if (key !== 'id') {
        modSql += `${key} = ?,`;
        modSqlParams.push(body[key]);
      }
    });
    modSql = modSql.substring(0, modSql.length - 1);
    modSql += `WHERE id = ?`;
    modSqlParams.push(body['id']);
    console.log(modSql);
    // const modSql = 'UPDATE FLYOVERS SET name = ?,url = ? WHERE Id = ?';
    // const modSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 6];
    // 修改数据库中的数据
    connection.query(modSql, modSqlParams, function(err, result) {
      if (err) {
        console.log('[UPDATE ERROR] - ', err.message);
        return;
      }
      console.log(result);
      res.status(200).end();
    });
  }
});

app.listen(3000, () => {
  console.log('App is running on port 3000!');
});
