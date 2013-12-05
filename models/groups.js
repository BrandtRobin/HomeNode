var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	name: String,
	members: [Number]
});


module.exports = mongoose.model('Group', schema);
