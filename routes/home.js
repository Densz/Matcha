var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
    if (req.session.success === undefined){
        res.render('signin',{
            title: 'Matcha - Sign In',
            errors: [{msg: 'No access right.'}]
        })
    }
    res.render('home', {
        title: 'Matcha - Sign In',
    });
});

module.exports = router;