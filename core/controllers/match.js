const model = require('../models/database.js');

const filterBySex = async function (info, req) {
    if (info['orientation'] === 'Women') {
        let array = await model.getData('users', {sex: 'female', login: {$ne: req.session.login}});
        return array;    
    } else if (info['orientation'] === 'Men') {
        let array = await model.getData('users', {sex: 'male', login: {$ne: req.session.login}});
        return array;
    } else {
        let array = await model.getData('users', {login: {$ne: req.session.login}});
        return array;
    }
};

const filterByFilters = async function (info, peopleArray) {
    let i = 0;
    let newPeopleArray = [];
    console.log(peopleArray.length);
    while (i < peopleArray.length) {
        if (info['filter']['age'][0] > peopleArray[i]['age'] || info['filter']['age'][1] < peopleArray[i]['age'])
        {
            peopleArray = peopleArray.slice(i);
            i--;
        }
        i++;
    }
    return peopleArray;
}

module.exports = {
    'filterBySex': filterBySex,
    'filterByFilters': filterByFilters
}