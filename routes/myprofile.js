const express = require('express');
const router = express.Router();
import path from 'path';
const model = require('../core/models/database');
const score = require('../core/controllers/score');
const fs = require('fs');
const views = require('../core/controllers/views');
const multer = require('multer');


const imageFilter = function(req, file, cb){
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/) || file.size > 3145728) {
        req.session.success.push({msg: 'File not allowed'});
        cb(null, false);
    } else {
        cb(null, true);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('destination');
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        console.log('filename');      
        cb(null, req.session.login + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    fileFilter: imageFilter,
    storage: storage
});


router.get('/', async (req, res, next) => {
    // A ENLEVER
    if (req.session.login === undefined) {
        req.session.login = 'arlecomt';
    }
    //update of popularity score
    let statistics = await score.updateScore(req.session.login);

    let db = await model.connectToDatabase();
    let userOnline = await db.collection('users').findOne({ login: req.session.login });
    let viewers = await views.getViewers(userOnline);
    let likes = await views.getLikes(userOnline);
    
    // Notifications
    let notifs = await model.getDataSorted('notifications', { to: req.session.login }, { date: 1 });
    let newNotif = await model.getData('notifications', { to: req.session.login, seen: false });

    // Images
    let imagesArray = await db.collection('users').findOne({ login: req.session.login }, {images: 1});

    // Profile picture
    let profilePic = await db.collection('users').findOne({ login: req.session.login}, { profilePicture: 1});

    if (profilePic.profilePicture === undefined) {
        profilePic.profilePicture = '/images/basic_profile_picture.png';
    } else {
        profilePic.profilePicture = '/uploads/' + profilePic.profilePicture;
    }

    if (newNotif === "No data") {
        newNotif = undefined;
    }
    let alertMessage = req.session.success;
    req.session.success = [];
    res.render('myprofile', {
        layout: 'layout_nav',
        firstName: userOnline['firstName'],
        lastName: userOnline['lastName'],
        login: req.session.login,
        notifications: notifs,
        newNotif: newNotif,
        bio: userOnline['bio'],
        popularityScore: userOnline['popularityScore'],
        title: 'Matcha - My profile',
        viewers: viewers,
        likes: likes,
        statistics: statistics,
        success: alertMessage,
        image: imagesArray.images,
        profilePic: profilePic.profilePicture
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

router.post('/uploadPhotos', upload.single('upload'), function(req, res){
    try {
        let field = {login: req.session.login},
            item = {$push: {images: req.file.filename}};
        console.log('117 upload photo = ', req.file);
        model.updateData('users', field, item);
        res.redirect('/myprofile');
    } catch (err) {
        console.log(err);
        res.redirect('/myprofile');
    }
});

router.post('/changingpic', async (req, res) => {
    console.log(req.body.frontPic);
    let field = { login: req.session.login},
        picName = req.body.frontPic.split("/"),
        item = { $set: {profilePicture: picName[4]}};
    await model.updateData('users', field, item);
    let db = await model.connectToDatabase();
    let imageArray = await db.collection('users').findOne({ login: req.session.login }, {images: 1});
    let currProfilePic = await db.collection('users').findOne({login: req.session.login}, {profilePicture: 1});
    imageArray.images.unshift(imageArray.images.splice(imageArray.images.indexOf(currProfilePic.profilePicture), 1)[0]);
    model.updateData('users', field, { $set: { images: imageArray.images }});
});

router.post('/erasePicture', async (req, res) => {
    let db = await model.connectToDatabase(),
        profilePic = await db.collection('users').findOne({ login: req.session.login}, { profilePicture: 1});

    db.collection('users').update(
        { login: req.session.login },
        { $pull: { images: req.body.pictureToErase}}
    );
    fs.unlinkSync('public/uploads/' + req.body.pictureToErase);
    if (profilePic.profilePicture === req.body.pictureToErase) {
        let field = {login: req.session.login},
            item = { $unset: {profilePicture: req.body.pictureToErase}};
        model.updateData('users', field, item);
        // res.send('ProfilePicture deleted');
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end('ProfilePicture deleted');
    }
    console.log('picture deleted');
});

module.exports = router;