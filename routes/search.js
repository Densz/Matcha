const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const socketIO = require('../core/controllers/socket');
const notifications = require('../core/controllers/notifications');
const filter = require('../core/controllers/notifications');
const search = require('../core/controllers/search');

router.get('/', async function (req, res) {
    req.session.errors = [];
    req.session.login = (req.session.login === undefined ? 'densz' : req.session.login);
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        // Connexion with socket.io
        socketIO.connexionChat(req);
        notifications.saveNotificationsToDatabase(req);

        // Notifications
        let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
        let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });
        if (newNotif === "No data") {
            newNotif = undefined;
        }

        // Render results
        res.render('search', {
            layout: 'layout_nav',
            login: req.session.login,
            newNotif: newNotif,
            notifications: notifs,
            post: req.body,
            location: undefined,
            filter: undefined,
            errors: undefined
        });
    }
});

router.post('/result', async function(req, res, next) {
    // Connexion with socket.io
    socketIO.connexionChat(req);
    notifications.saveNotificationsToDatabase(req);

    // Notifications
    let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
    let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });
    if (newNotif === "No data") {
        newNotif = undefined;
    }

    //Get address info
    let locationDetails = await search.getAddress(req);

    //Filter people
    let filter = await search.filter(req);

    let errors = req.session.errors;
    req.session.errors = [];
    
    res.render('search', {
        layout: 'layout_nav',
        login: req.session.login,
        newNotif: newNotif,
        notifications: notifs,
        post: req.body,
        location: locationDetails.location.address,
        filter: filter,
        errors: errors
    });
});

module.exports = router;