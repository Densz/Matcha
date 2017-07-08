const model = require('../models/database.js');

const filterBySex = async function (info) {
    if (info['orientation'] === 'Women') {
        let array = await model.getData('users', {sex: 'female'});
        return array;    
    } else if (info['orientation'] === 'Men') {
        let array = await model.getData('users', {sex: 'male'});
        return array;
    } else {
        let array = await model.getData('users', {});
        return array;
    }
};

module.exports = {
    'filterBySex': filterBySex
}