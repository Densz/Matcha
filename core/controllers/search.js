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

const queryFilter = async function(req, loc) {
    let blockedUser = await model.getData('blockedUsers', { userOnline: req.session.login });
    let json = {};
    let sort = {};

    // jsonFilter
    json.sex = req.body['orientation'] === 'women' ? 'female' : req.body['orientation'] === 'men' ? 'male' : { $regex: ".*male" };
    json.login = { $ne: req.session.login };
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

module.exports = {
    'getAddress' : getAddress,
    'filter': filter,
    'queryFilter': queryFilter
};