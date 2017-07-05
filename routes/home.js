const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const request = require('request');

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
            orientation: info['orientation'],
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
    console.log("rentre ici ta mere");
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

module.exports = router;