var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var model = require('../core/models/database');

var ret = model.getData('users').then((val) => {
	console.log("callback :", val);
}).catch((err) => {
	console.error(err);
});

var hello = model.HelloWorld();
console.log(hello);

var url = 'mongodb://localhost:27017/matcha';

router.get('/', (req, res, next) => {
	let errors = req.session.errors;
	req.session.errors = null;
	/*model.getData.then(function(val){
		console.log(val);
	}).catch(function(){
		console.log("merde");
	})*/;
	res.render('signIn', {
		title: 'Matcha - Sign In',
		errors: errors
	});
})

router.post('/submit', function(req, res, next){
});

module.exports = router;