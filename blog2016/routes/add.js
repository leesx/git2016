var express = require('express');
var router = express.Router();
var db = require('./../common/db')

/* GET home page. */
router.get('/add', function(req, res, next) {
    res.render('add');

});

module.exports = router;
