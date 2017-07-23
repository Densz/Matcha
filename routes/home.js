const express = require('express');
const router = express.Router();
const request = require('request');
const getAge = require('get-age');
const model = require('../core/models/database');
const filter = require('../core/controllers/filter');
const score = require('../core/controllers/score');
const match = require('../core/controllers/match');
const socketIO = require('../core/controllers/socket');
const conversation = require('../core/controllers/conversation');

router.get('/', async function (req, res) {
    req.session.errors = [];
    // LINE TO DELETE TO REMOVE REDIRECTION TO DENSZ
    if (req.session.login === undefined) {
        req.session.login = 'densz';
    }
    req.io.once('connection', function(socket) {
        // Connection to chat - set user online or offline
        if (req.session.login !== undefined) {
            model.updateData('users', { login: req.session.login }, { $set: { status: 'online' } });
            req.io.sockets.emit('new user connection', req.session.login);
        } else {
            model.updateData('users', { login: req.session.login }, { $set: { status: 'offline' } });
            req.io.sockets.emit('user disconnected', req.session.login);           
        }
        socket.on('disconnect', function(socket) {
            req.io.sockets.emit('user disconnected', req.session.login);            
            model.updateData('users', { login: req.session.login }, { $set: { status: 'offline' } });
        })

        // Send chat message - to update Front
        socket.on('send message to back', async function(data){
            req.io.sockets.emit('Alert people new message', data);
            let db = await model.connectToDatabase();
            let receiver = await db.collection('users').findOne({ login: data['to'] });
            let sender = await db.collection('users').findOne({ login: data['from'] });
            model.insertData('conversations', { from: req.session.login, to: data['to'], message: data['message'], date: new Date() })
            let value = {
                from: sender,
                to: receiver,
                message: data['message']
            };
            req.io.emit('send message response back', value);
        })
    });
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
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
        let filter2 = await filter.filterByViews(user, filter1);
        let finalFilter = await filter.filterByInterests(user, filter2);        

        // Matches
        let matches = await match.getMatches(req);

        // Conversations
        let conversations = await conversation.getConversations(req, matches);
        console.log('conversations: ', conversations);

        // Render results
        res.render('home', {
            layout: 'layout_nav',
            people: finalFilter,
            user: user,
            dob: getAge(user['dob']),
            matches: matches,
            conversations: conversations,
            title: 'Matcha - Home'
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
        await match.checkMatch(req.body.loginSwiped, req);
    }
    res.send('ok');
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

module.exports = router;