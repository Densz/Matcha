const model = require('../models/database.js');

const getViewers = async function(userOnline){
    let viewers = await model.getData('views', { userSeen: userOnline['login'] });
    let finalViewers = [];
    let db = await model.connectToDatabase();
    let i = 0;
    if(Array.isArray(viewers)){
        while (viewers[i]) {
            let tmp = await db.collection('users').findOne({ login: viewers[i]['userOnline'] }, { login: 1, firstName: 1, lastName: 1, sex: 1, profilePicture: 1 });
            finalViewers.push(tmp);
            i++;
        }
        return finalViewers;
    } else {
        return undefined;
    }
};

const getLikes = async function(userOnline) {
    let viewers = await model.getData('views', { userSeen: userOnline['login'], status: 'like' });
    let finalViewers = [];
    let db = await model.connectToDatabase();
    let i = 0;

    if(Array.isArray(viewers)){
        while (viewers[i]) {
            let tmp = await db.collection('users').findOne({ login: viewers[i]['userOnline'] }, { login: 1, firstName: 1, lastName: 1, sex: 1, profilePicture: 1 });
            finalViewers.push(tmp);
            i++;
        }
        return finalViewers;
    } else {
        return undefined;
    }
}

module.exports = {
    'getViewers': getViewers,
    'getLikes': getLikes
}