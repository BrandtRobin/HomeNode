var suncalc = require('./suncalc');
var mongoose = require('mongoose');
var configs = mongoose.model('Config');
var tdtool = require('./tdtool');

function fetchdata(lat, lng, callback) {
	var date = new Date();
	var times = suncalc.getTimes(new Date(), lat, lng);
	var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
	var sunsetStr = times.sunset.getHours() + ':' + times.sunset.getMinutes();
	var dawndusk = [
		{
			'sunrise': times.sunrise,
			'sunset': times.sunset
		}
	];
	callback(dawndusk);
}

function getnewtime() {
	setTimeout(function () {
		configs.findById(1, function (err, data) {
			if (err) throw err;
			////console.log('from db: ' + data.lat + ' ' + data.lon);
			fetchdata(data.lat, data.lon, function (data) {
				var upH = data[0].sunrise.getHours();
				var upM = data[0].sunrise.getMinutes();
				var downH = data[0].sunset.getHours();
				var downM = data[0].sunset.getMinutes();
				updatetime(upH, upM, downH, downM);
				////console.log('new time is: ' + upH + ':' + upM + ' and ' + downH + ':' + downM)
			});
		});
		getnewtime();
	}, 300000); //every 6th hour fetch the new times.
}

updatetime = function (upH, upM, downH, downM) {
	var toInsert = {
		upHour: upH,
		upMinute: upM,
		downHour: downH,
		downMinute: downM
	};
	configs.update({_id: 1}, toInsert, {upsert: true}, function (err, data) {
		if (err) throw err;
	});
}

function check() {
	setTimeout(function () {
		configs.findById(1, function (err, data) {
			if (err) throw err;
			if (data.autoDownActive || data.autoUpActive || data.manDownActive || data.manUpActive) {
				if (data.group !== null || data.group !== undefined) {
					var date = new Date();
					if (data.autoUpActive) {
//                        console.log('running autoUpActive ' + data.upHour + ':' + data.upMinute);
						var date = new Date();
						if (err) throw err;
						if (data.upHour == date.getHours()) {
							if (data.upMinute == date.getMinutes()) {
								var data = {
									body: {
										group: data.group,
										state: false,
										internalcall: true
									}
								};
								tdtool.toggleall(data, function () {
								});
							}
						}
					}
					else if (data.manUpActive) {
//                        console.log('running manUpActive ' + data.manupHour + ':' + data.manupMinute);
						if (data.manupHour == date.getHours()) {
							if (data.manupMinute == date.getMinutes()) {
								var data = {
									body: {
										group: data.group,
										state: false,
										internalcall: true
									}
								};
								tdtool.toggleall(data, function () {
								});
							}
						}
					}
					if (data.autoDownActive) {
//                        console.log('running autoDownActive ' + data.downHour + ':' + data.downMinute);
						if (data.downHour == date.getHours()) {
							if (data.downMinute == date.getMinutes()) {
								var data = {
									body: {
										group: data.group,
										state: true,
										internalcall: true
									}
								};
								tdtool.toggleall(data, function () {
								});
							}
						}
					}
					else if (data.manDownActive) {
//                        console.log('running manDownActive ' + data.mandownHour + ':' + data.mandownMinute);
						if (data.mandownHour == date.getHours()) {
							if (data.mandownMinute == date.getMinutes()) {
								var data = {
									body: {
										group: data.group,
										state: true,
										internalcall: true
									}
								};
								tdtool.toggleall(data, function () {
								});
							}
						}
					}
				}
			}
		});

		check();
//	}, 35000)
	}, 15000);
}

//Fetch the time at script start.
configs.findById(1, function (err, data) {
    if (err) throw err;
	//console.log('from db: ' + data.lat + ' ' + data.lon);
    fetchdata(data.lat, data.lon, function (data) {
        var upH = data[0].sunrise.getHours();
        var upM = data[0].sunrise.getMinutes();
        var downH = data[0].sunset.getHours();
        var downM = data[0].sunset.getMinutes();
	    updatetime(upH, upM, downH, downM);
    });
});

//Start timer.
getnewtime();
check();
