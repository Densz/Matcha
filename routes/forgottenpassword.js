const express = require('express');
const router = express.Router();
const model = require('../core/models/database');

router.get('/', function(req, res){
    let errors = req.session.errors;
    let success = req.session.success;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        req.session.errors = null;
        req.session.success = null;

        res.render('forgottenpassword', {
            title: 'Matcha - Forgotten password',
            errors: errors,
            success: success
        });
    }
});

router.post('/submit', async function(req, res){
    req.session.errors = [];
    req.session.success = [];
    let db = await model.connectToDatabase();
    let email = await db.collection('users').findOne({ email: req.body.email });

    if (email === null) {
        req.session.errors.push({msg: "Email not found."});
        res.redirect('/forgottenpassword');
    } else {
        req.session.success.push({msg: "Email sent."});
        res.redirect('/forgottenpassword');
    }
});

module.exports = router;