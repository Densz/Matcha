var express = require('express');
var router = express.Router();
var model = require('../core/models/database');

router.get('/', function(req, res, next){
	let errors = req.session.errors;
	res.render('signUp', { 
		title: 'Matcha - Sign Up',
		success: req.session.success,
		errors: errors
	});
});

router.post('/submit', function(req, res, next){
    console.log("rentre dedans ", req.session.errors);
    console.log("login ", req.body.login);
    model.getData('users', {login: req.body.login}).
	then(function(val){
		req.session.errors = 'Login already taken';
        res.redirect('/signUp');
    }).catch(function(err){
		console.log('Login not found ', err);
	});

	model.getData('users', {email: req.body.email}).
	then(function(val){
		req.session.errors = 'Email already taken';
	}).catch(function(err){
		console.log('Email not found ', err);
	});

});

module.exports = router;