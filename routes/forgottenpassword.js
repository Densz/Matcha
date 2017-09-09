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
                user: '42matcha2017@gmail.com',
                pass: 'qwerty2017'
            },
            tls: { rejectUnauthorized: false }
        }));

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Matcha" <42matcha2017@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Hello - Reset Password - Matcha', // Subject line
            html: '<p>Hello</p><br><p>To reset your password, click the link below<p><a href="http://localhost:3000/resetpassword/' + email['_id'] + '">Reset password</a><br><br><br>Kind regards,<br>Team Matcha'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return ;//console.log(error);
            }
            //console.log('Message %s sent: %s', info.messageId, info.response);
        });
        res.redirect('/forgottenpassword');
    }
});

module.exports = router;