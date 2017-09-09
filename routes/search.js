const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const socketIO = require('../core/controllers/socket');
const notifications = require('../core/controllers/notifications');
const filter = require('../core/controllers/notifications');
const search = require('../core/controllers/search');

router.get('/', async function (req, res) {
    req.session.errors = [];
    
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
            title: 'Matcha - Search',
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
    if (req.body.location === "" && (req.body.filter === "location down" || req.body.filter === "location up")) {
        req.session.errors.push({ msg: "Cannot filter by location without location set" });
    }
    if (req.body.hashtags !== "" && (req.body.filter === "tags down" || req.body.filter === "tags up")) {
        req.session.errors.push({ msg: "Cannot filter by common tags if hashtags filter is set" });
    }
    let queryFilter = await search.queryFilter(req, locationDetails);
    let filter = await search.filter(queryFilter);

    if (req.body.filter === "location down") {
        filter.reverse();
    } else if (req.body.filter === "tags up" || req.body.filter === "tags down") {
        filter = await search.filterByCommonTags(filter, req);
    }

    let errors = req.session.errors;
    req.session.errors = [];
    
    res.render('search', {
        layout: 'layout_nav',
        title: 'Matcha - Search',
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