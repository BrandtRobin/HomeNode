var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	upHour: Number,
	upMinute: Number,
	downHour: Number,
	downMinute: Number,
	lat: String,
	lon: String,
	group: Number
});

module.exports = mongoose.model('Config', schema);
