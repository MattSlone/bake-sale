'use strict';

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  next();
});

module.exports = router;
