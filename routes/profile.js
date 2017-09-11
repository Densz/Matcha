const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const score = require('../core/controllers/score');
const match = require('../core/controllers/match');
const fs = require('fs');
const views = require('../core/controllers/views');
const notifications = require('../core/controllers/notifications');

router.get('/:login', async function(req, res, next){
    if (req.params.login === req.session.login) {
        res.redirect('/myprofile');
    } else {
        if (req.session.login !== undefined) {
            // Connexion with socket.io
            notifications.saveNotificationsToDatabase(req);

            //update of popularity score
            let statistics = await score.updateScore(req.params.login);

            //get Views and Likes
            let db = await model.connectToDatabase();
            let user = await db.collection('users').findOne({ login: req.params.login });
            let likesMe = await db.collection('views').findOne({ userOnline: req.params.login, userSeen: req.session.login, status: 'like' });
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

            //Did you block him/her
            let blocked = await db.collection('blockedUsers').findOne({
                userOnline: req.session.login,
                userBlocked: req.params.login
            });

            // Notifications
            let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
            let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });
            if (newNotif === "No data") {
                newNotif = undefined;
            }
            
            // Profile picture
            let profilePic = await db.collection('users').findOne({ login: req.params.login}, { profilePicture: 1});
            let userOnlinePic = await db.collection('users').findOne({ login: req.session.login}, { profilePicture: 1});

            if (profilePic.profilePicture === undefined) {
                profilePic.profilePicture = '/images/basic_profile_picture.png';
            } else {
                profilePic.profilePicture = '/uploads/' + profilePic.profilePicture;
            }
            res.render('profile', {
                layout: 'layout_nav',
                firstName: user['firstName'],
                lastName: user['lastName'],
                dob: user['age'],
                bio: user['bio'],
                sex: user['sex'],
                lastConnection: user['lastConnection'],
                status: user['status'],
                hashtags: user['hashtag'],
                likesMe: likesMe,
                notifications: notifs,
                newNotif: newNotif,
                loginProfile: user['login'],
                login: req.session.login,
                popularityScore: user['popularityScore'],
                title: 'Matcha - Profile',
                viewers: viewers,
                swiped: swiped,
                reported: reported,
                blocked: blocked,
                likes: likes,
                statistics: statistics,
                profilePic: profilePic.profilePicture,
                userOnlinePic: userOnlinePic.profilePicture
            });
        } else {
            req.session.errors = [];
            req.session.errors.push({ msg: 'No access right' });
            res.redirect('/');
        }
    }
});

router.get('/report/reported/:login', async function(req, res){
    if (req.session.login === undefined ) {
        req.session.errors = [];
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        await model.insertData('reports', {
            login: req.session.login,
            reportedLogin: req.params.login
        });
        res.redirect('/profile/' + req.params.login);
    }
});

router.get('/dislike/users/login/:login', async function(req, res){
    if (req.session.login === undefined ) {
        req.session.errors = [];
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        await model.updateData('views',
            { userOnline: req.session.login, userSeen: req.params.login, status: 'like' },
            { $set: { status: 'dislike' } }
        );
        res.redirect('/profile/' + req.params.login);
    }
});

router.get('/block/:block/:login', async function(req, res){
    if (req.session.login === undefined ) {
        req.session.errors = [];
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        let db = await model.connectToDatabase();
        if (req.params.block === 'block') {
            await model.insertData('blockedUsers',
            {
                userOnline: req.session.login,
                userBlocked: req.params.login
            });
        } else if (req.params.block === 'unblock') {
            await db.collection('blockedUsers').remove(
                {
                    userOnline: req.session.login,
                    userBlocked: req.params.login
                }
            );
        }
        res.redirect('/profile/' + req.params.login);
    }
});

module.exports = router;