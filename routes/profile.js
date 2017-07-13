const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const score = require('../core/controllers/score');
const formidable = require('formidable');
const fs = require('fs');
const views = require('../core/controllers/views');

router.get('/:login', async function(req, res, next){
    if (req.params.login === req.session.login) {
        res.redirect('/myprofile');
    } else {
        //update of popularity score
        let statistics = await score.updateScore(req.params.login);

        //get Views and Likes
        let db = await model.connectToDatabase();
        let user = await db.collection('users').findOne({ login: req.params.login });
        let viewers = await views.getViewers(user);
        let likes = await views.getLikes(user);

        //Did you already swipe him/her
        let swiped = await db.collection('views').findOne({ 
            userOnline: req.session.login,
            userSeen: req.params.login
        });
        if (swiped !== null) {
            swiped = swiped['status'];
        }

        //Did you report him/her
        let reported = await db.collection('reports').findOne({
            login: req.session.login,
            reportedLogin: req.params.login
        });

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
            reported: reported,
            likes: likes,
            statistics: statistics
        });
    }
});

router.get('/:login/:status', async function(req, res){
    if (req.params.status === 'like' || req.params.status === 'dislike') {
        await model.insertData('views', {
            userOnline: req.session.login,
            userSeen: req.params.login,
            status: req.params.status
        });
        res.redirect('/profile/' + req.params.login);
    } else {
        res.redirect('/profile/' + req.params.login);
    }
});

router.get('/report/reported/:login', async function(req, res){
    await model.insertData('reports', {
        login: req.session.login,
        reportedLogin: req.params.login
    });
    res.redirect('/profile/' + req.params.login);
});

module.exports = router;