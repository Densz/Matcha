const express = require('express');
const router = express.Router();
const model = require('../core/models/database');

router.get('/', function(req, res, next){
    res.render('myprofile', {
        layout: 'layout_nav',
        title: 'Matcha - My profile'
    });
});

router.post('/editName', function(req, res, next) {
    console.log(req.session.login);
    let field = {login: req.session.login},
        item = {$set:{firstName: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
            lastName: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1)}};
    model.updateData('users', field, item);
    res.redirect('/myprofile');
});

module.exports = router;