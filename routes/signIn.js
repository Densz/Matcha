var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
mongoose.connect('localhost:27017/matcha')

router.get('/', function(req, res, next) {
		res.render('signIn', {
		title: 'Matcha', 
		success: req.session.success,
		errors: req.session.errors
	});
	req.session.errors = null;
})

router.post('/submit', function(req, res, next){
	console.log(req.body)
	res.redirect('/signin');
});

module.exports = router;