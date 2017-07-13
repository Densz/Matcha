const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const score = require('../core/controllers/score');
const formidable = require('formidable');
const fs = require('fs');
const views = require('../core/controllers/views');

router.get('/:login', async function(req, res, next){
    //update of popularity score
    let statistics = await score.updateScore(req.param('login'));

    let db = await model.connectToDatabase();
    let userOnline = await db.collection('users').findOne({ login: req.param('login') });
    let viewers = await views.getViewers(userOnline);
    let likes = await views.getLikes(userOnline);

    res.render('profile', {
        layout: 'layout_nav',
        firstName: userOnline['firstName'],
        lastName: userOnline['lastName'],
        bio: userOnline['bio'],
        popularityScore: userOnline['popularityScore'],
        title: 'Matcha - My profile',
        viewers: viewers,
        likes: likes,
        statistics: statistics
    });
});

module.exports = router;