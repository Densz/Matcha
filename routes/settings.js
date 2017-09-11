const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const socketIO = require('../core/controllers/socket');
const passwordHash = require('password-hash');
const request = require('request');

router.get('/', async function (req, res) {
    if (req.session.login === undefined) {
         req.session.errors = [];
        req.session.errors.push({msg: 'No access right'});
        res.redirect('/');
    } else {
        // Connexion to socket.io
        socketIO.connexionChat(req);

        let db = await model.connectToDatabase();
        let info = await db.collection('users').findOne({ login: req.session.login });

        let alertMessage = req.session.success;
        let errorMessage = req.session.errors;

        // Notifications
        let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
        let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });
        if (newNotif === "No data") {
            newNotif = undefined;
        }

        req.session.success = [];
        req.session.errors = [];
        res.render('settings', {
            layout: 'layout_nav',
            title: 'Matcha - Settings',
            login: req.session.login,
            notifications: notifs,
            newNotif: newNotif,
            address: info['address'],
            tmpAddress: info['tmpAddress'],
            success: alertMessage,
            errors: errorMessage
        });
    }
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
            req.session.errors.push({ msg: 'Email confirmation is not the same' });
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

/**
 * AJAX
 */
router.post('/getAddress', async function (req, res) {
    await model.updateData('users', { login: req.session.login }, { $set: {
        tmpAddress: req.body.tmpAddress, 
        tmpLat: req.body.tmpLat,
        tmpLng: req.body.tmpLng
    }});
    let db = await model.connectToDatabase();
    let user = await db.collection('users').findOne({ login: req.session.login });
    if (user['lat'] === undefined) {
        await model.updateData('users', { login: req.session.login }, { $set: {
            location: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.tmpLng),
                    parseFloat(req.body.tmpLat)
                ]
            }
        }} );
        res.send("Okay");
    } else {
        res.send("Okay");
    }

});

module.exports = router;