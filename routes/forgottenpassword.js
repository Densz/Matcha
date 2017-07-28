const express = require('express');
const router = express.Router();
const model = require('../core/models/database');

router.get('/', function(req, res){
    let errors = req.session.errors;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        req.session.errors = null;

        res.render('forgottenpassword', {
            title: 'Matcha - Forgotten password',
            errors: errors
        });
    }
});

router.post('/submit', async function(req, res){
});

module.exports = router;