var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/matcha';
var Promise = require('promise');
var resultArray = [];

var getData = function (table) {
	return new Promise(function(resolve, reject) {
		mongo.connect(url, function(err, db) {
			if (assert.equal(null, err))
				reject("Error from database connection");
			var cursor = db.collection(table).find();
			cursor.forEach(function(doc, err) {
				if (assert.equal(null, err))
					reject("Error from get data");
				resultArray.push(doc);
			}, function() {
				db.close();
				(resultArray.length) ? resolve(resultArray) : resolve("No data");
			});
		});
	});
};

var HelloWorld = () => {
	return ("Hi !");
}

module.exports = { 
	'getData' : getData, 
	'HelloWorld' : HelloWorld
};