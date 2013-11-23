var mongoose = require('mongoose');
var units = mongoose.model('Unit');
var configs = mongoose.model('Config');
var autotimes = mongoose.model('Autotime');
var sys = require('sys');
var exec = require('child_process').exec;
var child;

listunits = function(req, res) {
	units.find({}, null, {sort:{_id: 1}},function (err, data) {
			if (err) throw err;
			res.send(data); 
		});
}

getTimes = function(req, res) {
	configs.find({_id:1},function (err, data) {
			if (err) throw err;
			res.send(data); 
		});
}

getautovalue = function(req, res) {
	// HANDLE ERRORS IF RECORD DOES NOT EXIST!
	autotimes.findById(1, function (err, data) {
		res.send(data.active);
	});
}

toggleauto = function(req, res) {
	// HANDLE ERRORS IF RECORD DOES NOT EXIST!
	autotimes.findById(1, function (err, data) {
		var state = data.active;
		if (state == true) {
			state = false;
		}
		else if (state == false) {
			state = true;
		}
		autotimes.update({_id:1},{active:state},{upsert:true},function (err, data) {
			if (err) throw err;
			res.send(state);
		});
    });
    
}

toggleone = function(req, res) {
	var str = "tdtool ";
	var tmp = req.body;
	console.log(tmp._id + ' ' + tmp.state);
	if (tmp.state == true ) {
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
	units.update({_id:tmp._id},{state:tmp.state},function (err, data) {
		if (err) throw err;
		res.json(JSON.stringify(true));
	});
}

toggleall = function(req, res) {
	var str = "tdtool ";
	var tmp = req.body;
	if (tmp.state == true ) {
		str = str + "--on ";
	} 
	else {
		tmp.state = false;
		str = str + "--off ";
	}
	units.find({}, null, {sort:{_id: 1}},function (err, data) {
		if (err) throw err;
		data.forEach( function(i) { 
     		child = exec(str + i._id, function (error, stdout, stderr) {
    			if (error !== null) {
        			console.log('exec error: ' + error);
    			}
    		});
    		
		});
		units.update({},{state:tmp.state},{multi:true},function (err, data) {
			if (err) throw err;
			if (!tmp.internalcall || tmp.internalcall === undefined) {
				res.json(JSON.stringify(true));
			}
		});
	});	
}

addunit = function(req, res) {
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

deleteunit = function(req, res) {
	var toRemove = req.body;
  	units.findById(toRemove._id, function (err, data) {
      if (data !== undefined || data !== null) {
        units.remove({_id:toRemove._id}, function (err, data) {
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

syncunit = function(req, res) {
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

exports.toggleall = toggleall;
exports.toggleone = toggleone;
exports.listunits = listunits;
exports.getTimes = getTimes;
exports.toggleauto = toggleauto;
exports.getautovalue = getautovalue;
exports.addunit = addunit;
exports.deleteunit = deleteunit;
exports.syncunit = syncunit;