const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const passwordHash = require('password-hash');

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
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function validPassword(pwd) {
	let regex = /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
	return regex.test(pwd);
}

/**
 * Check les conditions des inputs
 */
router.post('/submit', function (req, res, next) {
    req.session.errors = [];
    if (req.body.login.length < 5)
        req.session.errors.push({msg: 'Login minlength = 5'});
	if (!validEmail(req.body.email))
        req.session.errors.push({msg: 'Invalid email'});
	if (req.body.password !== req.body.confirmPassword)
        req.session.errors.push({msg: 'Password confirmation must match Password'});
	if (!validPassword(req.body.password))
        req.session.errors.push({msg: 'Password minlength = 6, >=1 upper case, >=1 lower case, >=1 number'});
	next();
});

/**
 * Check les inputs par rapport a la base de donnée
 */
router.post('/submit', function(req, res, next) {
    model.getData('users', {login: req.body.login}).then(function (val) {
        req.session.errors.push({msg: 'Login already taken'});
    }).catch(function(err){
    	console.log(err, ' GOOD no email');
	}).then(function () {
        model.getData('users', {email: req.body.email}).then(function (val) {
            req.session.errors.push({msg: 'Email already taken'});
        }).catch(function(err) {
        	console.log(err, ' GOOD no email');
        }).then(function () {
            if (req.session.errors.length === 0)
                next();
            else
                res.redirect('/signUp');
        });
    });
});

/**
 * Insert les inputs vérifiés
 */
router.post('/submit', function(req, res, next) {
    let item = {
        firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
        lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
        login: req.body.login.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: passwordHash.generate(req.body.password)
	};
    model.insertData('users', item);
    req.session.success = true;
    res.redirect('/home');
});

module.exports = router;