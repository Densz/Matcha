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

const filter = async function(req) {
    let results = await model.getDataSorted('users', 
        {
            sex: req.body['orientation'] === 'Women' ? 'female' : req.body['orientation'] === 'Men' ? 'male' : { $regex: ".*male" },
            login: { $ne: req.session.login },
            // location: {
            //     $nearSphere: {
            //         $geometry: {
            //             type: "Point",
            //             coordinates: [userOnline['location']['coordinates'][0], userOnline['location']['coordinates'][1]]
            //         },
            //         $minDistance: 0,
            //         $maxDistance: 1000000
            //     } 
            // },
            $and: [ 
                    { age: { $gte: parseInt(req.body['age-min']) } }, 
                    { age: { $lte: parseInt(req.body['age-max']) } }, 
                    { popularityScore: { $gte: parseInt(req.body['score-min']) } }, 
                    { popularityScore: { $lte: parseInt(req.body['score-max']) } }
                ]
        },
        { 
            age: -1
        }
    );
    return results;
}

module.exports = {
    'getAddress' : getAddress,
    'filter': filter
};