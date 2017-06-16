var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var model = require('../core/models/database');
var Promise = require('promise');
var url = 'mongodb://localhost:27017/matcha';

//var db = model.getData;

var resultArray = [];

var test = new Promise(function(resolve, reject) {
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

router.get('/', (req, res, next) => {
	let errors = req.session.errors;
	req.session.errors = null;
	test.then(function(val){
		console.log(val);
	}).catch(function(){
		console.log("merde");
	});
	res.render('signIn', {
		title: 'Matcha - Sign In',
		errors: errors
	});
})

router.post('/submit', function(req, res, next){
});

module.exports = router;

/*let connect = () => {
	return new Promise(function (resolve, reject) {
		xhr.ajax({
				url : "my_url",
				type: "GET",
				data : {1, 2, 3},
				success: (e) => {
					resolve(e);
				},
				error : (e) => {
					reject(e);
				}
			})		
		});
};

connect.then({
	function (id)
	{
		console.log(id);
	}
}),catch({console.error("my promise failed"); });*/