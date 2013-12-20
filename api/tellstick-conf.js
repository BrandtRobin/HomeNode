var fs = require('fs');
var mongoose = require('mongoose');
var configs = mongoose.model('Config');
var configfile = '/etc/tellstick.conf';
var sys = require('sys');
var exec = require('child_process').exec;
var child;

function updatecoords(req, res) {
	console.log('update coords got: ' + JSON.stringify(req.body));
	tmp = req.body;
	configs.update({_id: 1}, {$set: {lat: tmp.lat, lon: tmp.lon}}, function (err, data) {
		if (err) throw err;
		res.send(true);
	});

}

function updateConf(req, res) {

	var myData = 'user = "nobody"\ngroup = "plugdev"\nignoreControllerConfirmation = "false"\n';

	req.body.forEach(function (x) {
		myData = myData + 'device {\n  id = "' + x._id + '"\n  name = "' + x.name + '"\n';
		myData = myData + '  protocol = "arctech"\n  model = "selflearning-switch"\n  parameters {\n';
		myData = myData + '    house = "17264"\n    unit = "' + x._id + '"\n  }\n}\n';

	});

	fs.writeFile(configfile, myData, function (err) {
		if (err) {
			console.log(err);
			res.json(JSON.stringify(false));
		} else {
			console.log("Configuration saved to " + configfile);
			//Send true to start the loading modal
			res.json(JSON.stringify(true));
			var str = "sudo service telldusd restart";
			child = exec(str, function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
		}
	});


}

exports.updateConf = updateConf;
exports.updatecoords = updatecoords;