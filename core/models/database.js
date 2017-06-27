const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/matcha';

const dbConnection = {
	connection(){
        return new Promise(function(res, rej){
            mongo.connect(url, function(err, db){
                if (err) {
                    reject(err);
                } else {
                    this.db = db;
                    resolve();
                }
            });
        });
    }
};

const getData = function(collection, condition) {
	return new Promise(function(resolve, reject) {
        let resultArray = [];
        mongo.connect(url, function(err, db) {
			if (assert.equal(null, err))
				reject("Error from database connection");
			var cursor = db.collection(collection).find(condition);
			cursor.forEach(function(doc, err) {
				if (assert.equal(null, err))
					reject("Error from get data");
				resultArray.push(doc);
			}, function() {
				db.close();
				(resultArray.length) ? resolve(resultArray) : reject("No data");
			});
		});
	});
};

const insertData = function(collection, item) {
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection(collection).insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('Item inserted');
			db.close();
		});
	});
};

const updateData = function (collection, field, item) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log('field = ' + field, 'item ' + item);
		db.collection(collection).update(field, item, function(err, result) {
			assert.equal(null, err);
			console.log('Item updated');
			db.close();
		});
	});
};

/**
 * Hello world function test
 * @param stringtest
 * @constructor
 */
function Hello(stringtest){
	this.string = stringtest;
}

Hello.prototype.show = function(){
	console.log(this.string);
};

const HelloWorld = new Hello('Salut depuis database');

/**
 * Export modules
 * @type {{getData: getData, HelloWorld: Hello}}
 */
module.exports = {
	'dbConnection': dbConnection,
	'getData': getData,
	'updateData': updateData,
	'insertData': insertData,
	'HelloWorld': HelloWorld
};