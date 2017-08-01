const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/matcha';

const connectToDatabase = function(){
    return new Promise(function(res, rej){
        mongo.connect(url, function(err, db){
            if (err){
                rej(err);
            } else {
                res(db);
            }
        });
    });
};

const getData = function(collection, condition) {
	return new Promise(function(resolve, reject) {
        let resultArray = [];
        mongo.connect(url, function(err, db) {
			if (assert.equal(null, err))
				resolve("Error from database connection");
			let cursor = db.collection(collection).find(condition);
			cursor.forEach(function(doc, err) {
				if (assert.equal(null, err))
					resolve("Error from get data");
				resultArray.push(doc);
			}, function() {
				db.close();
				(resultArray.length) ? resolve(resultArray) : resolve("No data");
			});
		});
	});
};

const getDataSorted = function(collection, condition, sort) {
	return new Promise(function(resolve, reject) {
        let resultArray = [];
        mongo.connect(url, function(err, db) {
			if (assert.equal(null, err))
				resolve("Error from database connection");
			let cursor = db.collection(collection).find(condition).sort(sort);
			cursor.forEach(function(doc, err) {
				if (assert.equal(null, err))
					resolve("Error from get data");
				resultArray.push(doc);
			}, function() {
				db.close();
				(resultArray.length) ? resolve(resultArray) : resolve("No data");
			});
		});
	});
};

const insertData = function(collection, item) {
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection(collection).insertOne(item, function(err, result){
			assert.equal(null, err);
			db.close();
		});
	});
};

const updateData = function (collection, field, item) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection(collection).update(field, item, function(err, result) {
			assert.equal(null, err);
			db.close();
		});
	});
};

module.exports = {
    'connectToDatabase': connectToDatabase,
	'getData': getData,
	'getDataSorted': getDataSorted,
	'updateData': updateData,
	'insertData': insertData
};