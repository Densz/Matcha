var express = require('express');
var router = express.Router();

function getUserData() {

}

router.get('/', function(req, res, next){
    if (req.session.login === undefined){
        res.render('signin',{
            title: 'Matcha - Sign In',
            errors: [{msg: 'No access right.'}]
        })
    }
    else {
	    res.render('home', {
	    	firstName: 'Kneth',
			lastName: 'Master',
	        title: 'Matcha - Sign In',
	    });
    }
});

module.exports = router;