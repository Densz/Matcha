const express = require('express');
const router = express.Router();
const model = require('../core/models/database');

router.get('/', async function (req, res) {
    req.session.errors = [];
    let db = await model.connectToDatabase();
    let info = await db.collection('users').findOne({ login: req.session.login });

    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        res.render('home', {
            layout: 'layout_nav',
            firstName: info['firstName'],
            lastName: info['lastName'],
            bio: info['bio'],
            sex: info['sex'],
            title: 'Matcha - Home'
        });
    }
});

module.exports = router;