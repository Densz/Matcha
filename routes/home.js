var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home', {
        layout: 'layout_nav',
        title: 'Matcha - Sign In'
    });
});

module.exports = router;