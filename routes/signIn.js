var express = require('express');
var router = express.Router();
var model = require('../core/models/database');

router.get('/', function(req, res, next){
	/*
	** Test Hello World ! with objects
	 */
	//model.HelloWorld.show();
	let errors = req.session.errors;
	req.session.errors = null;
	res.render('signIn', {
		title: 'Matcha - Sign In',
		errors: errors
	});
});

router.post('/submit', function(req, res, next){
	model.getData('users', {login: req.body.login, password: req.body.password}).
		then(function(val){
		req.session.success = true;
		res.redirect('/home');
	}).catch(function(err){
		req.session.success = false;
		req.session.errors = 'Authentication failed';
		res.redirect('/signIn');
	});
});

module.exports = router;