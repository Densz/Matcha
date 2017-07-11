const model = require('../models/database.js');

const filter = async function (info, req) {
    let array = await model.getData('users', {
        sex: info['orientation'] === 'Women' ? 'female' : info['orientation'] === 'Men' ? 'male' : { $regex: ".*male" },
        login: { $ne: req.session.login },
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [2.3756215, 48.8640713]
                },
                $minDistance: 0,
                $maxDistance: 10000
            } 
        },
        $and: [ 
                { age: { $gte: parseInt(info['filter']['minAge']) } }, 
                { age: { $lte: parseInt(info['filter']['maxAge']) } }, 
                { popularityScore: { $gte: parseInt(info['filter']['minScore']) } }, 
                { popularityScore: { $lte: parseInt(info['filter']['maxScore']) } }
            ],
    });
    if (Array.isArray(array)) {
        console.log('array db:', array);
        return array;
    } else {
        //If there is no data found from the premise model.getData
        //Array will contain an error
        console.log('Error message ==> ', array); 
        return undefined;
    }
};

module.exports = {
    'filter': filter
};