const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const passwordHash = require('password-hash');

router.get('/', function(req, res, next){
    let errors = req.session.errors;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        req.session.errors = null;

        res.render('index', {
            title: 'Matcha - Sign In',
            errors: errors
        });
    }
});

router.post('/submit', async function(req, res, next){
    req.session.errors = [];
    let db = await model.connectToDatabase();
    let value = await db.collection('users').findOne({login: req.body.login.toLowerCase()});

    if (value) {
        if (passwordHash.verify(req.body.password, value['password']) === true) {
            req.session.login = value['login'];
            res.redirect('/home');
        } else {
            req.session.errors.push({msg: 'Incorrect password'});
            res.redirect('/');
        }
    } else {
        req.session.login = undefined;
        req.session.errors.push({msg: 'Login does not exist'});
        res.redirect('/');
    }
});

module.exports = router;