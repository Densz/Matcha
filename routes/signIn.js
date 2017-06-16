var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var model = require('../core/models/database');

router.get('/', (req, res, next) => {
	let errors = req.session.errors;
	req.session.errors = null;
	res.render('signIn', {
		title: 'Matcha - Sign In',
		errors: errors
	});
})

router.post('/submit', function(req, res, next){
	model.getData('users', {login: req.body.login, password: req.body.password}).then((val) => {
		req.session.success === true;
		res.redirect('/home');
	}).catch((err) => {
		req.session.errors = err;
		res.redirect('/signIn');
	});
});

module.exports = router;