# Matcha
Tinder made by 42 Students

### Need to do
* Reset password (need to check if we have to do it)
* Upload photos
* Like
* Match / Swipe
* Chat (socket.io)
* Notifications

### Things done
* Sign In
* Templates (HTML/CSS/Bootstrap)
* Sign up
* Location

#### Details
* Need to add filters [age] and [score] for everybody in the databse users -- for presentation
* Babel
* Use of classes

#### Commands
* mongoimport --db matcha --collection users --drop --file ~/.../users.json --jsonArray
router.get('/', function(req, res, next){
    let errors = req.session.errors;

    if (req.session.login) {
        res.redirect('/home');
    } else {
        // A MODIFIER AUTOREDIRECT TO HOMEPAGE
        req.session.login = 'densz'
        res.redirect('/settings');
        // req.session.errors = null;
        // res.render('index', {
        //     title: 'Matcha - Sign In',
        //     errors: errors
        // });
    }
});