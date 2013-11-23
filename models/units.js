var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	name: String,
	state: Boolean,
});

module.exports = mongoose.model('Unit', schema);
