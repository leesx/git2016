var express = require('express');
var router = express.Router();
var db = require('./../common/db')

/* GET home page. */
router.get('/', function(req, res, next) {
    db.collection('articles').find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log('-----',result);
      res.render('index', { news_lists: result });
    });

});

module.exports = router;
