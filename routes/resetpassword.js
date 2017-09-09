const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const model = require('../core/models/database');
const passwordHash = require('password-hash');

router.get('/', (req, res) => {
    req.session.errors = [];
    req.session.errors.push({msg: 'No login found'});
    res.redirect('/');
});

router.get('/:id', function(req, res){
    let errors = req.session.errors;
    let success = req.session.success;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        req.session.errors = null;
        req.session.success = null;

        res.render('resetpassword', {
            title: 'Matcha - Reset password',
            errors: errors,
            success: success,
            id: req.params.id
        });
    }
});

router.post('/:id/submit', async function(req, res){
    req.session.errors = [];
    let checkObjID = new RegExp("^[0-9a-fA-F]{24}$");
    if (checkObjID.test(req.params.id) === false) {
        req.session.errors.push({msg: 'Page URL false'});
        res.redirect('/resetpassword/' + req.params.id);
    } else {
        req.session.success = [];
        let db = await model.connectToDatabase();
        let user = await db.collection('users').findOne({_id: objectId(req.params.id)});

        if (user === null) {
            req.session.errors.push({msg: 'User not found'});
            res.redirect('/resetpassword/' + req.params.id);        
        } else if (req.body.newPassword === req.body.newPasswordConfirmation) {
            await model.updateData('users', { _id: objectId(req.params.id) }, { $set: { password: passwordHash.generate(req.body.newPassword)} })
            req.session.success.push({msg: 'You password has been changed'});
            res.redirect('/resetpassword/' + req.params.id);
        } else {
            req.session.errors.push({msg: 'Password confirmation must match Password'});
            res.redirect('/resetpassword/' + req.params.id);
        }
    }
});

module.exports = router;