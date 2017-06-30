const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const passwordHash = require('password-hash');

router.get('/', function(req, res, next){
	if (req.session.login){
	    res.redirect('/home');
    } else {
        let errors = req.session.errors;
        req.session.errors = null;
        res.render('signUp', {
            title: 'Matcha - Sign Up',
            success: req.session.success,
            errors: errors
        });
    }
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
    console.log(req.body);
    req.session.errors = [];
    if (req.body.login.length < 5)
        req.session.errors.push({msg: 'Login minlength = 5'});
	if (!validEmail(req.body.email))
        req.session.errors.push({msg: 'Invalid email'});
	if (req.body.password !== req.body.confirmPassword)
        req.session.errors.push({msg: 'Password confirmation must match Password'});
	if (!validPassword(req.body.password))
        req.session.errors.push({msg: 'Password minlength = 6, >=1 upper case, >=1 lower case, >=1 number'});
	if (req.body.sex === undefined && (req.body.sex === 'male' || req.body.sex === 'female'))
	    req.session.errors.push({msg: 'Please fill sex info'});
	if (req.body.DOBMonth === '- Month -' || req.body.DOBDay === '- Day -' || req.body.DOBYear === '- Year -')
	    req.session.errors.push({msg: 'Please fill Date of Birth'});
	next();
});

/**
 * Check les inputs par rapport a la base de donnée
 */
router.post('/submit', async function(req, res, next) {
    let db = await model.connectToDatabase();
    let valueLog = await db.collection('users').findOne({login: req.body.login.toLowerCase()});
    let valueEmail = await db.collection('users').findOne({email: req.body.email.toLowerCase()});

    if (valueLog)
        req.session.errors.push({msg: 'Login already taken'});
    if (valueEmail)
        req.session.errors.push({msg: 'Email already taken'});
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
        firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
        lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
        login: req.body.login.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: passwordHash.generate(req.body.password),
        sex: req.body.sex,
        dob: req.body.DOBMonth + '/' + req.body.DOBDay + '/' + req.body.DOBYear
	};
    model.insertData('users', item);
    req.session.success = true;
    req.session.login = req.body.login;
    res.redirect('/home');
});

module.exports = router;