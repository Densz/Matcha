const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('settings', {
        layout: 'layout_nav',
        title: 'Matcha - Settings'
    });
});

module.exports = router;