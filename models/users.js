var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	isbn: String,
	userName: {type : String,required: true},
	password: {type : String,required: true},
});


module.exports = userSchema;
