var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	isbn: String,
	userName: {type : String,required: true},
	libraries: [{	bookName: String,
			rating: Number,}]
});


module.exports = BookSchema;
