const model = require('../models/database.js');

const getConversations = async function(req, matches){
    let conversations = [];
    let i = 0;

    if (matches !== undefined) {
        while (i < matches.length) {
            let tmp = await model.getDataSorted('conversations', {
                $or: [
                    { from: matches[i]['login'], to: req.session.login },
                    { from: req.session.login, to: matches[i]['login'] }
                ]
            }, { date: 1 });
            if (tmp !== 'No data') {
                conversations.push(tmp);
            } else {
                conversations.push([null]);
            }
            i++;
        }
        return (conversations);
    } else {
        return undefined;
    }
}

module.exports = { 
    'getConversations': getConversations
};