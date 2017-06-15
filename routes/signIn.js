var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
	var errors = req.session.errors;
	req.session.errors = null;
	res.render('signIn', {
		title: 'Matcha',
		errors: errors
	});
})

router.post('/submit', function(req, res, next){
});

module.exports = router;