const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const passwordHash = require('password-hash');

router.get('/', function(req, res, next){
	/*
	** Test Hello World ! with objects
	 */
	//model.HelloWorld.show();
	let errors = req.session.errors;
	req.session.errors = null;
	res.render('index', {
		title: 'Matcha - Sign In',
		errors: errors
	});
});

router.post('/submit', function(req, res, next){
    req.session.errors = [];
	model.getData('users', {login: req.body.login.toLowerCase()}).
	then(function(val){
			if (passwordHash.verify(req.body.password, val[0]['password']) === true) {
                req.session.login = val[0]['login'];
                res.redirect('/home');
			} else {
                req.session.errors.push({msg: 'Incorrect password'});
                res.redirect('/');
            }
	}).catch(function(err){
		req.session.login = undefined;
		req.session.errors.push({msg: 'Login does not exist'});
		res.redirect('/');
	});
});

module.exports = router;