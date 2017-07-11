const model = require('../models/database.js');

const filter = async function (info, req) {
    let array = await model.getData('users', {
        sex: info['orientation'] === 'Women' ? 'female' : info['orientation'] === 'Men' ? 'male' : { $regex: ".*male" },
        login: { $ne: req.session.login },
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [info['location']['coordinates'][0], info['location']['coordinates'][1]]
                },
                $minDistance: 0,
                $maxDistance: 1000000
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
        return array;
    } else {
        console.log('Error message ==> ', array); 
        return undefined;
    }
};

const countMatches = function(user1, user2){
    let matches = 0;
    let i;
    for (i = 0; i < user1.length; i++) {
        if (user2.indexOf(user1[i]) != -1)
            matches++;
    }
    return matches;
}

const filterByInterests = async function (userProfile, matches) {
    let i = 0;
    let newMatches = [];
    let hashtagFilter = userProfile['hashtagFilter'].length > 0 ? [ userProfile['hashtagFilter'] ] : userProfile['hashtag'];
    
    while (matches[i]) {
        let commonInterests = countMatches(matches[i]['hashtag'], hashtagFilter);
        if (commonInterests > 0) {
            newMatches.push(matches[i]);
        }
        i++;
    }
    if (newMatches.length === 0) {
        return undefined;
    } else {
        return newMatches;
    }
};

module.exports = {
    'filter': filter,
    'filterByInterests': filterByInterests
};