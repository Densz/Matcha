const model = require('../models/database.js');

const getViewers = async function(userOnline){
    let viewers = await model.getData('views', { userSeen: userOnline['login'] });
    let finalViewers = [];
    let db = await model.connectToDatabase();
    let i = 0;

    while (viewers[i]) {
        let tmp = await db.collection('users').findOne({ login: viewers[i]['userOnline'] }, { login: 1, firstName: 1, lastName: 1, sex: 1 });
        finalViewers.push(tmp);
        i++;
    }
    if (finalViewers.length === 0) {
        return undefined;
    } else {
        return finalViewers;
    }
};

module.exports = {
    'getViewers': getViewers
}