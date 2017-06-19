var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/matcha';
var resultArray = [];

var getData = function(collection, condition) {
	return new Promise(function(resolve, reject) {
		mongo.connect(url, function(err, db) {
			if (assert.equal(null, err))
				reject("Error from database connection");
			var cursor = db.collection(collection).find(condition);
			cursor.forEach(function(doc, err) {
				if (assert.equal(null, err))
					reject("Error from get data");
				console.log("getData:" , doc);
				resultArray.push(doc);
			}, function() {
				db.close();
				(resultArray.length) ? resolve(resultArray) : reject("No data");
			});
		});
	});
};

var insertData = function(collection, item) {
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection(collection).insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('Item inserted');
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

var HelloWorld = new Hello('Salut depuis database');

/**
 * Export modules
 * @type {{getData: getData, HelloWorld: Hello}}
 */
module.exports = { 
	'getData' : getData,
	'HelloWorld' : HelloWorld
};