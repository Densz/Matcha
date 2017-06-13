var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
mongoose.connect('localhost:27017/matcha')
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	login: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
}, {collection: 'users'})

var Users = mongoose.model('Users', userDataSchema);

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
		console.log('---- Data has been saved ----');
		req.session.success = true;
		res.redirect('/home');
	}
})

module.exports = router;