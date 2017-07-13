const model = require('../models/database.js');

const checkMatch = async function(loginLiked, req){
    let db = await model.connectToDatabase();
    let checkIfUserLikedYou = await db.collection('views').findOne({
        userOnline: loginLiked,
        userSeen: req.session.login,
        status: 'like'
    });
    if (checkIfUserLikedYou !== null) {
        await model.insertData('matches', {
            user1: loginLiked,
            user2: req.session.login
        })
        console.log('There is a match');    
    } else {
        console.log('There is NO match');
    }
}

module.exports = { 
    'checkMatch': checkMatch
};