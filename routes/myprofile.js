var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('myprofile', {
        layout: 'layout_nav',
        title: 'Matcha - My profile'
    });
});

module.exports = router;