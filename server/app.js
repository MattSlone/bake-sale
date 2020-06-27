const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const db = require('./db.js')
app.use(express.static(path.join(__dirname, '../build')));

app.get('/test', function (req, res) {
 console.log("testing")
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});


app.listen(process.env.PORT || 8080);
