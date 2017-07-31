const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const socketIO = require('../core/controllers/socket');
const notifications = require('../core/controllers/notifications');

router.get('/', async function (req, res) {
    req.session.errors = [];
    req.session.login = (req.session.login === undefined ? 'densz' : req.session.login);
    
    if (req.session.login === undefined) {
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    } else {
        console.log('POST : ' + req.body);
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
            notifications: notifs
        });
    }
});

router.post('/result', async function(req, res) {
    console.log(req.body);
    res.render('search', {
        layout: 'layout_nav',
        login: req.session.login,
        newNotif: newNotif,
        notifications: notifs
    });
});

module.exports = router;