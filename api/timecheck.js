var suncalc = require('./suncalc');
var mongoose = require('mongoose');
var configs = mongoose.model('Config');
var autotimes = mongoose.model('Autotime');
var tdtool = require('./tdtool');

function fetchdata(lat, lng, callback) {
	var date = new Date();
	var times = suncalc.getTimes(new Date(), lat, lng);
	var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
	var sunsetStr = times.sunset.getHours() + ':' + times.sunset.getMinutes();
	var dawndusk = [
		{
			'sunrise' : times.sunrise,
			'sunset' : times.sunset
		}
	];
	callback(dawndusk);
}

function getnewtime() {
	setTimeout(function() {
		configs.findById(1, function (err, data) {
	    	if (err) throw err;
    		//console.log('from db: ' + data.lat + ' ' + data.lon);
			fetchdata(data.lat, data.lon, function (data) {
				var upH = data[0].sunrise.getHours();
				var upM = data[0].sunrise.getMinutes();
				var downH = data[0].sunset.getHours();
				var downM = data[0].sunset.getMinutes();
				updatetime(upH, upM, downH, downM);
				//console.log('new time is: ' + upH + ':' + upM + ' and ' + downH + ':' + downM)
			});
		});
		getnewtime();
	}, 300000); //every 6th hour fetch the new times.
}

updatetime = function(upH, upM, downH, downM) {
	var toInsert = {
		upHour:upH,
		upMinute:upM,
		downHour:downH,
		downMinute:downM
	};
    configs.update({_id:1},toInsert,{upsert:true}, function (err, data) {
	    if (err) throw err;
    });
}

function check() {
	setTimeout(function() {
		autotimes.findById(1, function (err, data) {
			if (data.active) {
				var date = new Date();
				configs.find({_id:1},function (err, data) {
					if (err) throw err;
					if (data[0].upHour == date.getHours()) {
						if (data[0].upMinute == date.getMinutes()) {
							var data = {
								body: {
									state:false,
									internalcall:true
								}
							};
							tdtool.toggleall(data,function(){
							});
						}
					}
					else if (data[0].downHour == date.getHours()) {
						if (data[0].downMinute == date.getMinutes()) {
							var data = {
								body: {
									state:true,
									internalcall:true
								}
							};
							tdtool.toggleall(data,function(){
							});
						}
					}
				});
			}
			else {
				//skip the checking
			}
		});
		check();
	}, 35000);
}

//Fetch the time at script start.
fetchdata(59.274302, 15.209713, function (data) {
	var upH = data[0].sunrise.getHours();
	var upM = data[0].sunrise.getMinutes();
	var downH = data[0].sunset.getHours();
	var downM = data[0].sunset.getMinutes();
	updatetime(upH, upM, downH, downM);
});	

//Start timer.
getnewtime();
check();
