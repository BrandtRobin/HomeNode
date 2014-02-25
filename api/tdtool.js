var mongoose = require('mongoose');
var units = mongoose.model('Unit');
var groups = mongoose.model('Group');
var configs = mongoose.model('Config');
var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var child;

listunits = function (req, res) {
	units.find({}, null, {sort: {_id: 1}}, function (err, data) {
		if (err) throw err;
// console.log(data);
res.send(data);
});
}

listgroups = function (req, res) {
	groups.find({}, null, {sort: {_id: 1}}, function (err, data) {
		if (err) throw err;
		res.send(data);
	});
}

getConf = function (req, res) {
	configs.find({_id: 1}, function (err, data) {
		if (err) throw err;
		res.send(data);
	});
}

getautovalue = function (req, res) {
// HANDLE ERRORS IF RECORD DOES NOT EXIST!
autotimes.findById(1, function (err, data) {
	res.send(data.active);
});
}

changeautogroup = function (req, res) {
// HANDLE ERRORS IF RECORD DOES NOT EXIST!
// ÄNDRA AUTOGRUPP I CONFIGS COLLECTION
// console.log(req.body);
configs.update({_id: 1}, {group: req.body.group}, {upsert: true}, function (err, data) {
	if (err) throw err;
	res.json(JSON.stringify(true));
});
}

toggleauto = function (req, res) {
// HANDLE ERRORS IF RECORD DOES NOT EXIST!
autotimes.findById(1, function (err, data) {
	var state = data.active;
	if (state == true) {
		state = false;
	}
	else if (state == false) {
		state = true;
	}
	autotimes.update({_id: 1}, {active: state}, {upsert: true}, function (err, data) {
		if (err) throw err;
		res.send(state);
	});
});

}

toggleone = function (req, res) {
	var str = "tdtool ";
	var tmp = req.body;
	console.log(tmp._id + ' ' + tmp.state);
	if (tmp.state == true) {
		tmp.state = false;
		str = str + "--off " + tmp._id;
	}
	else {
		tmp.state = true;
		str = str + "--on " + tmp._id;
	}
	console.log(str);
	child = exec(str, function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
	units.update({_id: tmp._id}, {state: tmp.state}, function (err, data) {
		if (err) throw err;
		res.json(JSON.stringify(true));
	});
}

toggleall = function (req, res) {
	var str = "tdtool ";
	var tmp = req.body;
	if (tmp.state == true) {
		str = str + "--on ";
	}
	else {
		tmp.state = false;
		str = str + "--off ";
	}
	groups.findById(tmp.group, function (err, data) {
		if (err) throw err;
		var members = data.members;
		members.forEach(function (i) {
			child = exec(str + i, function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
		});
		units.update({_id: {$in: members}}, {$set: {state: tmp.state}}, {multi: true}, function (err, data) {
			if (err) throw err;
			if (!tmp.internalcall || tmp.internalcall === undefined) {
				res.json(JSON.stringify(true));
			}
		});
	});
}

addunit = function (req, res) {
	var toInsert = req.body;
	console.log('trying to add: ' + JSON.stringify(toInsert));
	units.findById(toInsert._id, function (err, data) {
		if (data === undefined || data === null) {
			console.log('creating');
			units.create(toInsert, function (err, data) {
				if (err) throw err;
			});
			res.json(JSON.stringify(true));
		}
		else {
			res.json(JSON.stringify(false));
			console.log('allready exists!');
		}
	});
}

updatemap = function (req, res) {
	var toInsert = req.body;
	units.update({_id:toInsert._id},{$set:{x:toInsert.x, y:toInsert.y}}, function (err, data) {
		if (err) throw err;
	});
	res.json(JSON.stringify(true));
}

deleteunit = function (req, res) {
	var toRemove = req.body;
	units.findById(toRemove._id, function (err, data) {
		if (data !== undefined || data !== null) {
			units.remove({_id: toRemove._id}, function (err, data) {
				if (err) throw err;
			});
			res.json(JSON.stringify(true));
		}
		else {
			res.json(JSON.stringify(false));
			console.log('unit does not exists!');
		}
	});
}

addgroup = function (req, res) {
	var toInsert = req.body;
	console.log('trying to add group: ' + JSON.stringify(toInsert));
	groups.findById(toInsert._id, function (err, data) {
		if (data === undefined || data === null) {
			console.log('creating');
			groups.create(toInsert, function (err, data) {
				if (err) throw err;
			});
			res.json(JSON.stringify(true));
		}
		else {
			res.json(JSON.stringify(false));
			console.log('group allready exists!');
		}
	});
}

deletegroup = function (req, res) {
	var toRemove = req.body;
	groups.findById(toRemove._id, function (err, data) {
		if (data !== undefined || data !== null) {
			groups.remove({_id: toRemove._id}, function (err, data) {
				if (err) throw err;
			});
			res.json(JSON.stringify(true));
		}
		else {
			res.json(JSON.stringify(false));
			console.log('group does not exists!');
		}
	});
}

syncunit = function (req, res) {
	var str = "tdtool --learn ";
	var tmp = req.body;
	str = str + req.body._id;
	console.log(str);
	child = exec(str, function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
//Do not send a response, modal will not show if error occured.
}
else {
	res.json(JSON.stringify(true));
}
});
}

savechangemanauto = function (req, res) {
	var tmp = req.body;
	var downtmp = tmp.ManDownTime;
	tmp2 = downtmp.split(':');
	var uptmp = tmp.ManUpTime;
	tmp3 = uptmp.split(':');

	configs.update({_id: 1},
		{$set: {mandownHour: tmp2[0],
			mandownMinute: tmp2[1],
			manupHour: tmp3[0],
			manupMinute: tmp3[1],
			manDownActive: tmp.manDownActive,
			manUpActive: tmp.manUpActive,
			autoDownActive: tmp.autoDownActive,
			autoUpActive: tmp.autoUpActive
		}}, function (err, data) {
			if (err) throw err;
			res.json(JSON.stringify(true));
		});
}

uploadbg = function (req, res) {
	var tempPath = req.files.file.path,
	targetPath = path.resolve('pics/plan1.png');
	if (path.extname(req.files.file.name).toLowerCase() === '.png') {
		fs.rename(tempPath, targetPath, function(err) {
// console.log('from ' + tempPath + ' to ' + targetPath);
if (err) throw err;
res.redirect('/map');
});
	} else {
		fs.unlink(tempPath, function () {
			console.error("A dumdum uploaded something else than a .png...");
			res.redirect('/map');
		});
	}	
}

exports.toggleall = toggleall;
exports.toggleone = toggleone;
exports.listunits = listunits;
exports.listgroups = listgroups;
exports.getConf = getConf;
exports.toggleauto = toggleauto;
exports.getautovalue = getautovalue;
exports.changeautogroup = changeautogroup;
exports.addunit = addunit;
exports.deleteunit = deleteunit;
exports.deletegroup = deletegroup;
exports.addgroup = addgroup;
exports.syncunit = syncunit;
exports.savechangemanauto = savechangemanauto;
exports.updatemap = updatemap;
exports.uploadbg = uploadbg;