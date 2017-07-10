const model = require('../models/database.js');

const filter = async function (info, req) {
    if (info['orientation'] === 'Women') {
        let array = await model.getData('users', {
            sex: info['orientation'] === 'Women' ? 'female' : info['orientation'] === 'Men' ? 'male' : { $regex: ".*male" },
            login: { $ne: req.session.login },
            $and: [ { age: { $gte: parseInt(info['filter']['minAge']) } }, { age: { $lte: parseInt(info['filter']['maxAge']) } } ]
        });
        if (Array.isArray(array)) {
            return array;
        } else {
            //If there is no data found from the premise model.getData
            //Array will contain an error
            console.log(array); 
            return undefined;
        }
};

module.exports = {
    'filter': filter
}