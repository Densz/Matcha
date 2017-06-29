const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    req.session.errors = [];
    if (req.session.login == undefined) {
        req.session.errors.push({msg: 'No access right'});
        res.redirect('/');
    } else {
        res.render('home', {
            layout: 'layout_nav',
            title: 'Matcha'
        });
    }
});

module.exports = router;