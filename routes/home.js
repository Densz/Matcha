const express = require('express');
const router = express.Router();
const request = require('request');
const getAge = require('get-age');
const model = require('../core/models/database');
const filter = require('../core/controllers/filter');
const score = require('../core/controllers/score');
const match = require('../core/controllers/match');
const socketIO = require('../core/controllers/socket');
const notifications = require('../core/controllers/notifications');
const conversation = require('../core/controllers/conversation');

router.get('/', async function (req, res) {
    req.session.errors = [];
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        // Connexion with socket.io
        socketIO.connexionChat(req);
        notifications.saveNotificationsToDatabase(req);
        // Update age each time the guy is connected in the homepage
        let db = await model.connectToDatabase();
        let user = await db.collection('users').findOne({ login: req.session.login });
        // Update des infos de l'user avant la connexion
        await score.updateScore(req.session.login);
        await model.updateData('users', { login: req.session.login }, { $set: {
            age: getAge(user['dob'])
        }});
        // Recuperation de l'user avec les informations a jour
        user = await db.collection('users').findOne({ login: req.session.login });
        // Filtres
        let filter1 = await filter.filter(user, req);
        let finalFilter = await filter.filterByViews(user, filter1);
        if (user.hashtagFilter === "") {
            finalFilter = await filter.filterByInterests(user, finalFilter);
        }
        if (user['filterBy'] === 'location-down') {
            finalFilter.reverse();    
        }
        if (finalFilter && finalFilter.length === 0) {
            finalFilter = undefined;
        }
        // Matches
        let matches = await match.getMatches(req);
        // Conversations
        let conversations = await conversation.getConversations(req, matches);
        // Notifications
        let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
        let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });
        if (newNotif === "No data") {
            newNotif = undefined;
        }
        // Profile picture
        let profilePic = await db.collection('users').findOne({ login: req.session.login}, { profilePicture: 1});

        if (profilePic.profilePicture === undefined) {
            profilePic.profilePicture = '/images/basic_profile_picture.png';
        } else {
            profilePic.profilePicture = '/uploads/' + profilePic.profilePicture;
        }

        // Render results
        res.render('home', {
            layout: 'layout_nav',
            people: finalFilter,
            login: req.session.login,
            notifications: notifs,
            newNotif: newNotif,
            user: user,
            dob: getAge(user['dob']),
            matches: matches,
            conversations: conversations,
            title: 'Matcha - Home',
            profilePic: profilePic.profilePicture
        });
    }
});

router.post('/addHashtag', async function (req, res) {
    if (req.body.hashtag) {
        let db = await model.connectToDatabase();
        let userInfo = await db.collection('users').findOne({ login: req.session.login });

        let arrayHashtag = userInfo['hashtag'];
        if (!arrayHashtag)
            arrayHashtag = [];
        arrayHashtag.push(req.body.hashtag);
        model.updateData('users', { login: req.session.login }, { $set: 
            { hashtag: arrayHashtag }
        });
    }
    res.redirect('/home');
});

router.post('/editOrientation', async function (req, res) {
    model.updateData('users', { login: req.session.login }, { $set: { orientation: req.body.orientation }});
    res.redirect('/home');
});

router.post('/editAddress', async function (req, res) {
    if (req.body.newAddress.length > 0) {
        let addressFormated = req.body.newAddress.replace(' ', '+');
        request('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressFormated + '&key=AIzaSyCOQ8rVn9XxjPhDwVyeqp4wuCoMUl95uLs', function(error, response, body){
            let addressDetails = JSON.parse(body);
            if (addressDetails['status'] !== "ZERO_RESULTS") {
                model.updateData('users', { login: req.session.login }, { $set: { 
                    address: addressDetails['results'][0]['formatted_address'], 
                    lat: addressDetails['results'][0]['geometry']['location']['lat'],
                    lng: addressDetails['results'][0]['geometry']['location']['lng'],
                    location: {
                        type: "Point",
                        coordinates: [
                            parseFloat(addressDetails['results'][0]['geometry']['location']['lng']),
                            parseFloat(addressDetails['results'][0]['geometry']['location']['lat'])
                        ]
                    }
                }} );
                res.redirect('/home');
            } else {
                req.session.errors.push({ msg: 'Address not found, please enter zip code or city for more precision' });
                res.redirect('/settings');
            }
        });
    } else {
        req.session.errors.push({ msg: 'No address entered' });   
        res.redirect('/settings');
    }
});

router.post('/hashtagFilter', async function (req, res) {
    model.updateData('users', { login: req.session.login }, { $set: {
        hashtagFilter: req.body.hashtagFilter
    }});
    res.redirect('/home');
});

router.post('/filterBy', async function (req, res) {
    model.updateData('users', { login: req.session.login }, { $set: {
        filterBy: req.body.filter
    }});
    res.redirect('/home');
});

/**
 * AJAX function
 */
router.post('/getFilter', async function (req, res){
    model.updateData('users', { login: req.session.login }, { $set: {
        filter: { 
            minAge: req.body.minAge, 
            maxAge: req.body.maxAge,
            minScore: req.body.minScore,
            maxScore: req.body.maxScore
        }
    }})
});

/**
 * AJAX function
 */
router.post('/swipe', async function (req, res){
    model.insertData('views', {
        userOnline: req.session.login,
        userSeen: req.body.loginSwiped,
        status: req.body.status
    });
    if (req.body.status === 'like'){
        let boolean = await match.checkMatch(req.body.loginSwiped, req);
        if (boolean === true) {
            res.send({ match: true });
        } else {
            res.send({ match: false });
        }
    } else {
        res.send({ match: false });
    }
});

/**
 * AJAX function
 */
router.post('/searchRequest', async function (req, res){
    let result = await model.getData('users', {
        $or: [
            {login: { $regex: ".*" + req.body.value + ".*" }},
            {lastName: { $regex: ".*" + req.body.value + ".*" }},
            {firstName: { $regex: ".*" + req.body.value + ".*" }},
            {login: { $regex: ".*" + req.body.value.charAt(0).toUpperCase() + req.body.value.slice(1) + ".*" }},
            {lastName: { $regex: ".*" + req.body.value.charAt(0).toUpperCase() + req.body.value.slice(1) + ".*" }},
            {firstName: { $regex: ".*" + req.body.value.charAt(0).toUpperCase() + req.body.value.slice(1) + ".*" }}
        ]
    });
    res.send(result);
});

/**
 * AJAX function
 */
router.post('/setSeenNotifications', async function (req, res){
    let db = await model.connectToDatabase();
    db.collection('notifications').update({ to: req.session.login }, { $set: { seen: true }}, { multi: true });
    res.send('ok');
});

/**
 * AJAX function
 */
router.post('/deleteHashtag', async function (req, res){
    let db = await model.connectToDatabase();
    db.collection('users').update(
        { login: req.session.login },
        { $pull: { hashtag: req.body.hashtagToDelete }}
    );
    res.send('ok');
});

router.post('/nextPicture', async (req, res) => {
    let db = await model.connectToDatabase();
    let imageArray = await db.collection('users').findOne({login: req.body.loginMatch}, {images: 1});
    var currIndex = imageArray.images.indexOf(req.body.indexCurrPic);
    if (imageArray.images[currIndex + 1] !== undefined) {
        res.send('/uploads/' + imageArray.images[currIndex + 1]);
    } else {
        res.send('/uploads/' + imageArray.images[0]);
    }
});

router.post('/previousPicture', async (req, res) => {
    let db = await model.connectToDatabase();
    let imageArray = await db.collection('users').findOne({login: req.body.loginMatch}, {images: 1});

    var currIndex = imageArray.images.indexOf(req.body.indexCurrPic);
    if (imageArray.images[currIndex - 1] !== undefined) {
        res.send('/uploads/' + imageArray.images[currIndex - 1]);
    } else {
        res.send('/uploads/' + imageArray.images[imageArray.images.length - 1]);
    }
});

module.exports = router;