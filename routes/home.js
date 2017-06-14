var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.success === undefined)
	{
		res.render('signIn', {
			errors: 'No access right'
		});
	}
	else {
		res.render('home', {
			title: 'Matcha'
		});
	}
});

module.exports = router;