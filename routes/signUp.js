var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
	res.render('signUp', { 
		title: 'Matcha',
		success: req.session.success,
		errors: req.session.errors
	});
	req.session.errors = null;
})

router.post('/submit', function(req, res, next) {
	//Check validity
	req.check('email', 'Invalid email address').isEmail();
	req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword);

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/signup');
	} else {
		req.session.success = true;
		res.redirect('/home');
	}
})

module.exports = router;