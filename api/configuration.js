var configfile = require('../config');

function sendconfig(req, res) {
	res.send(configfile);
}
exports.sendconfig = sendconfig;