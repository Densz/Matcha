const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const passwordHash = require('password-hash');
const geolib = require('geolib');
const request = require('request');

router.get('/', async function (req, res) {
    let db = await model.connectToDatabase();
    let info = await db.collection('users').findOne({ login: req.session.login });

    let alertMessage = req.session.success;
    let errorMessage = req.session.errors;

    req.session.success = [];
    req.session.errors = [];
    res.render('settings', {
        layout: 'layout_nav',
        title: 'Matcha - Settings',
        address: info['address'],
        success: alertMessage,
        errors: errorMessage
    });
});

router.post('/editEmail', async function (req, res) {
    let db = await model.connectToDatabase();
    let value = await db.collection('users').findOne({ login: req.session.login });
    let checkEmail = await db.collection('users').findOne({ email: req.body.newEmail });

    if (value['email'] === req.body.oldEmail) {
        if (req.body.newEmail === req.body.confirmNewEmail) {
            if (checkEmail) {
                req.session.errors.push({ msg: 'Email already taken' });
            } else {
                model.updateData('users', { login: req.session.login }, { $set: { email: req.body.newEmail } });
                req.session.success.push({ msg: 'Email has been updated' });
            }
        } else {
            req.session.errors.push({ msg: 'Confirmation password is not the same' });
        }
    } else {
        req.session.errors.push({ msg: 'Old email is different from the current email' });
    }
    res.redirect('/settings');
});

router.post('/editPassword', async function (req, res) {
    let db = await model.connectToDatabase();
    let user = await db.collection('users').findOne({ login: req.session.login });

    if (passwordHash.verify(req.body.oldPassword, user['password'])) {
        if (req.body.newPassword === req.body.confirmNewPassword) {
            model.updateData('users', { login: req.session.login }, { $set: { password: passwordHash.generate(req.body.newPassword) } });
            req.session.success.push({ msg: 'Your password has been updated' });
        } else {
            req.session.errors.push({ msg: 'New password confirmation is not the same' });
        }
    } else {
        req.session.errors.push({ msg: 'Incorrect password' });
    }
    res.redirect('/settings');
});

router.post('/editAddress', async function (req, res) {
    req.session.errors = [];
    req.session.success = [];
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
                req.session.success.push({ msg: 'Address updated' });
                res.redirect('/settings');
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

module.exports = router;