var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.send('这是商品管理');
});

module.exports = router;
