var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  req.session.destroy();
  console.log(req.session)
  res.render('signIn', {
  	errors: [{msg: 'You have been disconnected'}]
  });
});

module.exports = router;