var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	name: String,
	state: Boolean,
	x: Number,
	y: Number,
});

module.exports = mongoose.model('Unit', schema);
