var express = require('express');
var router = express.Router();
var db = require('./../../common/db')

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('comment/index')
});

module.exports = router;
