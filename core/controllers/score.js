const model = require('../models/database.js');

const updateScore = async function(userOnline){
    let db = await model.connectToDatabase();
    let countViews = await db.collection('views').find({userSeen: userOnline}).count();
    let countLikes = await db.collection('views').find({userSeen: userOnline, status: 'like'}).count();
    let statistics = [countLikes, countViews - countLikes];

    if (countViews === 0) {
        await model.updateData('users', {login: userOnline}, {$set: {
            popularityScore: parseInt(10)
        }});
    } else {
        await model.updateData('users', {login: userOnline}, {$set: {
            popularityScore: parseInt(Math.round(countLikes / countViews * 10))
        }});
    }
    return statistics;
}

module.exports = { 
    'updateScore': updateScore
};