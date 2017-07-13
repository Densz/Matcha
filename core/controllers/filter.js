const model = require('../models/database.js');

const filter = async function (userOnline, req) {
    let array = await model.getData('users', {
        sex: userOnline['orientation'] === 'Women' ? 'female' : userOnline['orientation'] === 'Men' ? 'male' : { $regex: ".*male" },
        login: { $ne: req.session.login },
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [userOnline['location']['coordinates'][0], userOnline['location']['coordinates'][1]]
                },
                $minDistance: 0,
                $maxDistance: 1000000
            } 
        },
        $and: [ 
                { age: { $gte: parseInt(userOnline['filter']['minAge']) } }, 
                { age: { $lte: parseInt(userOnline['filter']['maxAge']) } }, 
                { popularityScore: { $gte: parseInt(userOnline['filter']['minScore']) } }, 
                { popularityScore: { $lte: parseInt(userOnline['filter']['maxScore']) } }
            ],
    });
    if (Array.isArray(array)) {
        return array;
    } else {
        console.log('Error message ==> ', array); 
        return undefined;
    }
};

const filterByViews = async function (userOnline, matches) {
    let newMatches = [];
    let i = 0;
    let db = await model.connectToDatabase();

    if (matches) {
        while (matches[i]) {
            let view = await db.collection('views').findOne({ 
                userOnline: userOnline['login'],
                userSeen: matches[i]['login']
            });
            if (view === null)
                newMatches.push(matches[i]);
            i++;
        }
        return newMatches;
    } else {
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

const filterByInterests = async function (userOnline, matches) {
    let i = 0;
    let newMatches = [];
    let hashtagFilter = userOnline['hashtagFilter'].length > 0 ? [ userOnline['hashtagFilter'] ] : userOnline['hashtag'];
    
    if (hashtagFilter === undefined) {
        return undefined;
    }
    if (matches) {
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
    } else {
        return undefined;
    }
};

module.exports = {
    'filter': filter,
    'filterByInterests': filterByInterests,
    'filterByViews': filterByViews
};