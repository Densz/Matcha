const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const filter = require('../core/controllers/filter.js');
const score = require('../core/controllers/score.js');
const request = require('request');
const getAge = require('get-age');

router.get('/', async function (req, res) {
    req.session.errors = [];
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        //Update age each time the guy is connected in the homepage
        let db = await model.connectToDatabase();
        let userOnline = await db.collection('users').findOne({ login: req.session.login });
        
        //Update des infos de l'user avant la connexion
        await score.updateScore(req.session.login);
        await model.updateData('users', { login: req.session.login }, { $set: {
            age: getAge(userOnline['dob'])
        }});

        //recuperation de l'user avec les informations a jour
        userOnline = await db.collection('users').findOne({ login: req.session.login });
        
        //Matchs en fonction des filtres
        let allMatches = await filter.filter(userOnline, req);
        let matchesFiltered = await filter.filterByViews(userOnline, allMatches);
        let finalMatches = await filter.filterByInterests(userOnline, matchesFiltered);        

        //render result
        res.render('home', {
            layout: 'layout_nav',
            firstName: userOnline['firstName'],
            lastName: userOnline['lastName'],
            address: userOnline['address'],
            tmpAddress: userOnline['tmpAddress'],
            bio: userOnline['bio'],
            sex: userOnline['sex'],
            orientation: userOnline['orientation'],
            hashtag: userOnline['hashtag'],
            filter: userOnline['filter'],
            hashtagFilter: userOnline['hashtagFilter'],
            dob: getAge(userOnline['dob']),
            popularityScore: userOnline['popularityScore'],
            people: finalMatches,
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
});

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