const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const formidable = require('formidable');
const fs = require('fs');

router.get('/', async (req, res, next) => {
    let db = await model.connectToDatabase();
    let userOnline = await db.collection('users').findOne({ login: req.session.login });

    let alertMessage = req.session.success;
    req.session.success = [];
    res.render('myprofile', {
        layout: 'layout_nav',
        firstName: userOnline['firstName'],
        lastName: userOnline['lastName'],
        bio: userOnline['bio'],
        title: 'Matcha - My profile',
        success: alertMessage
    });
});

router.post('/editName', (req, res, next) => {
    let field = { login: req.session.login },
        item = {
            $set: {
                firstName: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
                lastName: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1)
            }
        };
    req.session.success = [];
    req.session.success.push({ msg: "Your First Name | Last Name have been updated" });
    model.updateData('users', field, item);
    res.redirect('/myprofile');
});

router.post('/editBio', (req, res) => {
    let field = { login: req.session.login },
        item = { $set: { bio: req.body.bio } };
    req.session.success = [];
    req.session.success.push({ msg: "Your Bio has been updated" });
    model.updateData('users', field, item);
    res.redirect('/myprofile');
});

router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();

    form.uploadDir = '/upload';
    console.log('form ->>>> ' + form);

    form.on('file', (field, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
    });

    form.on('end', () => {
        console.log('success !!');
        res.end('success');

        form.parse(req);
    })
});

module.exports = router;