var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
	var errors = req.session.errors
	res.render('signUp', { 
		title: 'Matcha - Sign Up',
		success: req.session.success,
		errors: errors
	});
	req.session.errors = null;
})

router.post('/submit', function(req, res, next) {

})

module.exports = router;