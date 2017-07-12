const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
    res.render('getposition', {
        title: 'OK'
    });
});

module.exports = router;