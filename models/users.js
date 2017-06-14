var mongoose = require('mongoose')
mongoose.connect('localhost:27017/matcha')
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	login: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
}, {collection: 'users'})

module.exports = mongoose.model('Users', userDataSchema);