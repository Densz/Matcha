var express = require('express');
var router = express.Router();
var model = require('../core/models/database');
var infoUser;


router.get('/', function(req, res, next){
    if (req.session.login === undefined){
        res.render('signin',{
            title: 'Matcha - Sign In',
            errors: [{msg: 'No access right.'}]
        })
    }
    else {
    	model.getData('users', {login: req.session.login}).
		then(function(val){
			infoUser = val[0];
			next();
		}).catch(function(err) {
			req.session.login = undefined;
			req.session.errors.push({msg: err[0]});
			res.redirect('/signIn');
		})
	   
    }
});

router.get('/', function(req, res) {
	res.render('home', {
		firstName: infoUser['firstName'],
		lastName: infoUser['lastName'],
		title: 'Matcha - Sign In'
    });
});

router.post('/submit/bio', function(req, res, next) {
	
});

module.exports = router;