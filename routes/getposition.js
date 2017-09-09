const express = require('express');
const router = express.Router();
const request = require('request');
const model = require('../core/models/database');

router.get('/', function(req, res, next){
    if (req.session.login === undefined) {
        res.redirect('/signup');
    } else {
        req.session.errors = [];
        res.render('getposition', {
            title: 'Matcha - Get your position'
        });
    }
});

router.get('/forceGetPos', function(req, res, next){
    if (req.session.login !== undefined) {
        request('http://freegeoip.net/json/', function(error, response, body){
            let data = JSON.parse(body);
            request('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + data.latitude + ',' + data.longitude, async function(error, response, body){
                let infos = JSON.parse(body);
                await model.updateData('users', { login: req.session.login }, {
                    $set: {
                        tmpAddress: infos['results'][0]['formatted_address'],
                        tmpLat: data.latitude,
                        tmpLng: data.longitude
                    }
                })
                let db = await model.connectToDatabase();
                let user = await db.collection('users').findOne({ login: req.session.login });
                if (user['lat'] === undefined) {
                    await model.updateData('users', { login: req.session.login }, { $set: {
                        location: {
                            type: "Point",
                            coordinates: [
                                parseFloat(data.longitude),
                                parseFloat(data.latitude)
                            ]
                        }
                    }} );
                    res.redirect('/home');
                } else {
                    res.redirect('/home');
                }
            });
        });
    } else {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/signUp');
    }
});

module.exports = router;