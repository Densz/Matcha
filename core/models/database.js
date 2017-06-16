var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/matcha';
var Promise = require('promise');
var resultArray = [];

var getData = new Promise(function(resolve, reject) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection('users').find();
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			resultArray.push(doc);
		}, function() {
			db.close();
		});
		resolve(resultArray);
	});
});

module.exports = getData;


/*
module.exports = {
	getData: function(collection, conditions = {}) 
	{
		mongo.connect(url, function(err, db)
		{
			assert.equal(null, err);
			var cursor = db.collection(collection).find(conditions);
			cursor.forEach(function(doc, err)
			{
				assert.equal(null, err);
				resultArray.push(doc);
			}, 
			function() 
			{
				db.close();
			})
		})
		var resultJson = JSON.stringify(resultArray);
		resultArray = [];
		return (resultJson);
	}
}*/

