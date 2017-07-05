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
            address: info['address'],
            tmpAddress: info['tmpAddress'],
            bio: info['bio'],
            sex: info['sex'],
            hashtag: info['hashtag'],
            title: 'Matcha - Home'
        });
    }
});

router.post('/addHashtag', async function (req, res) {
    if (req.body.hashtag) {
        let db = await model.connectToDatabase();
        let userInfo = await db.collection('users').findOne({ login: req.session.login });

        let arrayHashtag = userInfo['hashtag'];
        arrayHashtag.push([req.body.hashtag]);
        model.updateData('users', { login: req.session.login }, { $set: 
            { hashtag: arrayHashtag }
        });
    }
    res.redirect('/home');
});

module.exports = router;