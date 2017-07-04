import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy();
    res.render('index', {
        title: 'Matcha - Sign In',
        errors: [{msg: 'You have been disconnected'}]
    });
});

module.exports = router;