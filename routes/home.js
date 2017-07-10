const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const match = require('../core/controllers/match.js');
const request = require('request');
const getAge = require('get-age');

router.get('/', async function (req, res) {
    req.session.errors = [];
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        let db = await model.connectToDatabase();
        let info = await db.collection('users').findOne({ login: req.session.login });
        model.updateData('users', { login: req.session.login }, { $set: {
            age: getAge(info['dob'])
        }});
        /**
         * Algo du swipe ! Ca commence Allez !
         */
        let peopleArray = await match.filter(info, req);

        /**
         * Render
         */
        res.render('home', {
            layout: 'layout_nav',
            firstName: info['firstName'],
            lastName: info['lastName'],
            address: info['address'],
            tmpAddress: info['tmpAddress'],
            bio: info['bio'],
            sex: info['sex'],
            orientation: info['orientation'],
            hashtag: info['hashtag'],
            filter: info['filter'],
            hashtagFilter: info['hashtagFilter'],
            dob: getAge(info['dob']),
            people: peopleArray,
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
                    lng: addressDetails['results'][0]['geometry']['location']['lng']
                }} );
                res.redirect('/home');
            } else {
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/home');
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

module.exports = router;