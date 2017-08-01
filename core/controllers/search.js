const model = require('../models/database.js');
const request = require('request');

const getAddress = function(req) {
    return new Promise(function(res){
        if (req.body.location !== "") {
            let addressFormated = req.body.location.replace(' ', '+');
            request('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressFormated + '&key=AIzaSyCOQ8rVn9XxjPhDwVyeqp4wuCoMUl95uLs', function(error, response, body){
                let addressDetails = JSON.parse(body);
                if (addressDetails['status'] !== "ZERO_RESULTS") {
                    let locationDetails = { location: 
                        {
                            address: addressDetails['results'][0]['formatted_address'],
                            type: "Point",
                            coordinates: [
                                parseFloat(addressDetails['results'][0]['geometry']['location']['lng']),
                                parseFloat(addressDetails['results'][0]['geometry']['location']['lat'])
                            ]
                        }
                    }
                    res(locationDetails);
                } else {
                    req.session.errors.push({ msg: 'Address not found' });
                    res({ location: { address: undefined }});
                }
            });
        } else {
            res({ location: { address: undefined }});
        }
    })
}

const getBlockedUser = async function(req) {
    let blockedUser = await model.getData('blockedUsers', { userOnline: req.session.login });
    let array = [];

    array.push(req.session.login);
    if (blockedUser !== "No data") {
        let i = 0;
        while (i < blockedUser.length) {
            array.push(blockedUser[i].userBlocked);
            i++;
        }
        return array;
    } else {
        return array;
    }
}

const queryFilter = async function(req, loc) {
    let blockedUser = await getBlockedUser(req);
    let json = {};
    let sort = {};

    // jsonFilter
    json.sex = req.body['orientation'] === 'women' ? 'female' : req.body['orientation'] === 'men' ? 'male' : { $regex: ".*male" };
    json.login = { $nin: blockedUser };
    if (req.body['hashtags'] !== "") {
        let hashtags = req.body['hashtags'].split(' ');
        json.hashtag = { $all: hashtags };
    }
    if (loc.location.address) {
        json.location = {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        loc.location.address ? loc.location.coordinates[0] : 0,
                        loc.location.address ? loc.location.coordinates[1] : 0
                    ]
                },
                $minDistance: 0,
                $maxDistance: 1000000
            } 
        };
    }
    json.$and = [ 
                    { age: { $gte: parseInt(req.body['age-min']) } }, 
                    { age: { $lte: parseInt(req.body['age-max']) } }, 
                    { popularityScore: { $gte: parseInt(req.body['score-min']) } }, 
                    { popularityScore: { $lte: parseInt(req.body['score-max']) } }
                ];
    // sortFilter
    if (req.body.filter === 'age up') {
        sort.age = 1;
    } else if (req.body.filter === 'age down') {
        sort.age = -1;
    } else if (req.body.filter === 'popularity up') {
        sort.popularityScore = 1;
    } else if (req.body.filter === 'popularity down') {
        sort.popularityScore = -1;
    }
    let queries = [json, sort];
    return (queries);
}

const filter = async function(queryFilter) {
    let results = await model.getDataSorted('users', 
        queryFilter[0],
        queryFilter[1]
    );
    if (results === "No data") {
        return undefined;
    } else {
        return results;
    }
}

const compare = function (a, b) {
  return a.commonTags - b.commonTags;
}

const filterByCommonTags = async function(array, req) {
    let db = await model.connectToDatabase();
    let userTags = await db.collection('users').findOne({ login: req.session.login });
    let i = 0;
    while (i < array.length) {
        let value = array[i].hashtag.filter(function(e) {
            return userTags.hashtag.indexOf(e) > -1;
        });
        array[i].commonTags = value.length;
        i++;
    }
    array.sort(compare);
    if (req.body.filter === "tags up") {
        array.reverse();
    }
    return array;
}

module.exports = {
    'getAddress' : getAddress,
    'filter': filter,
    'queryFilter': queryFilter,
    'filterByCommonTags': filterByCommonTags,
    'getBlockedUser': getBlockedUser
};1