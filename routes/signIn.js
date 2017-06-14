var express = require('express')
var router = express.Router()
var Users = require('../models/users.js');

router.get('/', function(req, res, next) {
		res.render('signIn', {
		title: 'Matcha', 
		success: req.session.success,
		errors: req.session.errors
	});
	req.session.errors = null;
})

router.post('/submit', function(req, res, next){
	Users.find({login: req.body.login, password: req.body.password})
	.then(function(doc){
		if (doc.length == 0) {
			req.session.errors = 'login not found or password incorrect';
			res.redirect('/signin');
		} else {
			req.session.success = true;
			req.session.login = req.body.login;
			res.redirect('/home');
		}
	})
});

module.exports = router;