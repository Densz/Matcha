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
        });
        return true;
    } else {
        return false;
    }
}

const getMatches = async function(req) {
    let matches = await model.getData('matches', {
        $or: [{ user1: req.session.login }, { user2: req.session.login }]
    });
    let db = await model.connectToDatabase();
    let matchesInfo = [];
    let i = 0;
    if (matches !== "No data") {    
        while (i < matches.length) {
            if (matches[i]['user1'] === req.session.login) {
                let userInfo = await db.collection('users').findOne( { login: matches[i]['user2'] } );
                matchesInfo.push(userInfo);
            } else {
                let userInfo = await db.collection('users').findOne( { login: matches[i]['user1'] } );
                matchesInfo.push(userInfo);
            }
            i++;
        }
        return matchesInfo;
    } else {
        return undefined;
    }
}

module.exports = { 
    'checkMatch': checkMatch,
    'getMatches': getMatches
};