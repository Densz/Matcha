var express = require('express')
var router = express.Router()
var Users = require('../models/users.js');

router.get('/', function(req, res, next) {
	res.render('signUp', { 
		title: 'Matcha',
		success: req.session.success,
		errors: req.session.errors
	});
	req.session.errors = null;
})

router.post('/submit', function(req, res, next) {
	req.check('email', 'Invalid email address').isEmail();
	req.check('password', 'Password minimum length').isLength({min: 4});
	req.check('password', 'Password / Password confirmation are not the same').equals(req.body.confirmPassword);

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/signup');
	} else {
		var userInfo = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			login: req.body.login,
			email: req.body.email,
			password: req.body.password 
		}
		var data = new Users(userInfo);
		data.save();
		req.session.success = true;
		req.session.login = req.body.login;
		res.redirect('/home');
	}
})

module.exports = router;