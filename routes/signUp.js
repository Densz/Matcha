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

router.post('/submit', function(req, res, next){
	req.session.errors = [];
	model.getData('users', {login: req.body.login}).then(function(val) {
		req.session.errors.push({msg: 'Login already taken'});
	}).catch(function(err){
        console.log('No login found : Good');
	}).then(function(){
		model.getData('users', {email: req.body.email}).then(function (val) {
			req.session.errors.push({msg: 'Email already taken'});
		}).catch(function(err){
			console.log('No email found : Good');
		}).then(function(){
            if (req.session.errors.length)
            	res.redirect('signUp');
			else {
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
			}
        });
	})
});



module.exports = router;