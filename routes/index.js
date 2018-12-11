var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var views = 1;
  var tips = '';
  var sess = req.session;
  if (sess.views) {
      views = sess.views;
      sess.views++;
  } else {
      sess.views = 1;
      tips = "welcome";
  }
  res.render('index', { title: 'Express', views: views, tips: tips });
});

module.exports = router;
