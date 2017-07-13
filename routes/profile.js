const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const score = require('../core/controllers/score');
const formidable = require('formidable');
const fs = require('fs');
const views = require('../core/controllers/views');

router.get('/:login', async function(req, res, next){
    if (req.param('login') === req.session.login) {
        res.redirect('/myprofile');
    } else {
        //update of popularity score
        let statistics = await score.updateScore(req.param('login'));

        //get Views and Likes
        let db = await model.connectToDatabase();
        let user = await db.collection('users').findOne({ login: req.param('login') });
        let viewers = await views.getViewers(user);
        let likes = await views.getLikes(user);

        //Did you already swipe him/her
        let swiped = await db.collection('views').findOne({ 
            userOnline: req.session.login,
            userSeen: req.param('login')
        });
        console.log(swiped);
        if (swiped !== null) {
            swiped = swiped['status'];
        }

        res.render('profile', {
            layout: 'layout_nav',
            firstName: user['firstName'],
            lastName: user['lastName'],
            bio: user['bio'],
            login: user['login'],
            popularityScore: user['popularityScore'],
            title: 'Matcha - My profile',
            viewers: viewers,
            swiped: swiped,
            likes: likes,
            statistics: statistics
        });
    }
});

router.get('/:login/:status', async function(req, res, next){
    if (req.param('status') === 'like' || req.param('status') === 'dislike') {
        await model.insertData('views', {
            userOnline: req.session.login,
            userSeen: req.param('login'),
            status: req.param('status')
        });
        res.redirect('/profile/' + req.param('login'));
    } else {
        res.redirect('/profile/' + req.param('login'));
    }
});

module.exports = router;