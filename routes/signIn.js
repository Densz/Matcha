var express = require('express');
var router = express.Router();
var model = require('../core/models/database');
var passwordHash = require('password-hash');

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
    req.session.errors = [];
	model.getData('users', {login: req.body.login.toLowerCase()}).
		then(function(val){
			if (passwordHash.verify(req.body.password, val[0]['password']) === true) {
                req.session.success = false;
                res.redirect('/home');
			} else {
                req.session.errors.push({msg: 'Incorrect password'});
                res.redirect('/signIn');
            }
	}).catch(function(err){
		req.session.success = false;
		req.session.errors.push({msg: 'Login does not exist'});
		res.redirect('/signIn');
	});
});

module.exports = router;