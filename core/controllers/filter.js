const model = require('../models/database.js');
const search = require('./search.js');

const queryFilterHome = async function(req, userOnline) {
    let blockedUser = await search.getBlockedUser(req);
    let json = {};
    let sort = {};

    json.sex = userOnline['orientation'] === 'Women' ? 'female' : userOnline['orientation'] === 'Men' ? 'male' : { $regex: ".*male" };
    json.login = { $nin: blockedUser };
    json.profilePicture = { $exists: true };
    if (userOnline['hashtagFilter'] !== "") {
        let hashtags = userOnline['hashtagFilter'].split(' ');
        json.hashtag = { $all: hashtags };
    }
    json.location = {
        $nearSphere: {
            $geometry: {
                type: "Point",
                coordinates: [userOnline['location']['coordinates'][0], userOnline['location']['coordinates'][1]]
            },
            $minDistance: 0,
            $maxDistance: 100000
        } 
    };
    json.$and = [ 
                { age: { $gte: parseInt(userOnline['filter']['minAge']) } }, 
                { age: { $lte: parseInt(userOnline['filter']['maxAge']) } }, 
                { popularityScore: { $gte: parseInt(userOnline['filter']['minScore']) } }, 
                { popularityScore: { $lte: parseInt(userOnline['filter']['maxScore']) } }
            ];
    if (userOnline['filterBy'] === 'age-up') {
        sort.age = 1;
    } else if (userOnline['filterBy'] === 'age-down') {
        sort.age = -1;
    } else if (userOnline['filterBy'] === 'popularity-up') {
        sort.popularityScore = 1;
    } else if (userOnline['filterBy'] === 'popularity-down') {
        sort.popularityScore = -1;
    }
    let queries = [json, sort];
    return (queries);
}

const filter = async function (userOnline, req) {
    let queryFilter = await queryFilterHome(req, userOnline);
    let array = await model.getDataSorted('users', queryFilter[0], queryFilter[1]);
    if (Array.isArray(array)) {
        return array;
    } else {
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
    let hashtagFilter = userOnline['hashtag'];
    
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