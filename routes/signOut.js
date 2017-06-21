var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.session.destroy();
  res.render('signIn', {
  	title: 'Matcha - Sign In',
  	errors: [{msg: 'You have been disconnected'}]
  });
});

module.exports = router;