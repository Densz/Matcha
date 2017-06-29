const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.session.destroy();
    res.render('index', {
        title: 'Matcha - Sign In',
        errors: [{msg: 'You have been disconnected'}]
    });
});

module.exports = router;