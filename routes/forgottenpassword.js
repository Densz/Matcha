const express = require('express');
const router = express.Router();
const model = require('../core/models/database');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

router.get('/', function(req, res){
    let errors = req.session.errors;
    let success = req.session.success;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        req.session.errors = null;
        req.session.success = null;

        res.render('forgottenpassword', {
            title: 'Matcha - Forgotten password',
            errors: errors,
            success: success
        });
    }
});

router.post('/submit', async function(req, res){
    req.session.errors = [];
    req.session.success = [];
    let db = await model.connectToDatabase();
    let email = await db.collection('users').findOne({ email: req.body.email });

    if (email === null) {
        req.session.errors.push({msg: "Email not found."});
        res.redirect('/forgottenpassword');
    } else {
        req.session.success.push({msg: "Email sent."});

        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'zheng.denis@gmail.com',
                pass: ''
            },
            tls: { rejectUnauthorized: false }
        }));

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Denis" <zheng.denis@gmail.com>', // sender address
            to: 'Denis Zheng, zheng.denis@gmail.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world ?', // plain text body
            html: '<b>Hello world ?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        res.redirect('/forgottenpassword');
    }
});

module.exports = router;