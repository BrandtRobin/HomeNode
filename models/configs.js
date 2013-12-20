var mongoose = require('mongoose');

var schema = mongoose.Schema({
	_id: Number,
	upHour: Number,
	upMinute: Number,
	downHour: Number,
	downMinute: Number,
	lat: String,
	lon: String,
	group: Number,
	mandownHour: Number,
	mandownMinute: Number,
	manupHour: Number,
	manupMinute: Number,
	manUpActive: Boolean,
	manDownActive: Boolean,
	autoUpActive: Boolean,
	autoDownActive: Boolean,
});

module.exports = mongoose.model('Config', schema);
