var mongoose = require('mongoose');

var schema = mongoose.Schema({
	deviceID: Number,
	date: String,
	datetime: Number,
	temperature: Number,
});

module.exports = mongoose.model('Temperature', schema);
