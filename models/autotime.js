var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	active: Boolean
});

module.exports = mongoose.model('Autotime', schema);
