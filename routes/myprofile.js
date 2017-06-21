var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    if (req.session.login === undefined){
        res.render('signin',{
            title: 'Matcha - Sign In',
            errors: [{msg: 'No access right.'}]
        })
    }
    else {
        res.render('myprofile', {
            title: 'Matcha - My profile'
        });
    }
});

module.exports = router;