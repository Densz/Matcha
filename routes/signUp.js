var express = require('express');
var router = express.Router();
var model = require('../core/models/database');

router.get('/', function(req, res, next){
	let errors = req.session.errors;
    req.session.errors = null;
	res.render('signUp', { 
		title: 'Matcha - Sign Up',
		success: req.session.success,
		errors: errors
	});
});

function validEmail(email) {
	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function validPassword(pwd) {
	var regex = /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
	return regex.test(pwd);
}

/**
 * Check les conditions des inputs
 */
router.post('/submit', function (req, res, next) {
	var errno = 0;
    req.session.errors = [];
    if (req.body.login.length < 6) {
        req.session.errors.push({msg: 'Login minlength = 6'});
		errno++;
	}
	if (!validEmail(req.body.email)) {
        req.session.errors.push({msg: 'Invalid email'});
		errno++;
    }
	if (req.body.password !== req.body.confirmPassword) {
        req.session.errors.push({msg: 'Passwords entered are differents'});
		errno++;
	}
	if (!validPassword(req.body.password)) {
        req.session.errors.push({msg: 'Password minlength = 6, >=1 upper case, >=1 lower case, >=1 number'});
		errno++;
	}
	if (errno == 0)
		next();
	else
        res.redirect('/signUp');
});

/**
 * Check les inputs par rapport a la base de donnée
 */
router.post('/submit', function(req, res, next) {
    model.getData('users', {login: req.body.login}).then(function(val) {
		req.session.errors.push({msg: 'Login already taken'});
	});
    model.getData('users', {email: req.body.email}).then(function(val) {
        req.session.errors.push({msg: 'Email already taken'});
    });
    if (req.session.errors.length === 0)
    	next();
    else
    	res.redirect('/signUp');
});

/**
 * Insert les inputs vérifiés
 */
router.post('/submit', function(req, res, next) {
    let item = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
	};
    model.insertData('users', item);
    req.session.success = true;
    res.redirect('/home');
});

module.exports = router;