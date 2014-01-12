var sonos = require('sonos');

// IP IF BRIDGE OR CONTROLLING SPEAKER
var sonos_host = '13.37.1.133';
var s = new sonos.Sonos(sonos_host);

// s.queueSpotify(function(err, data) {
// 	console.log(data);
// });

var io = require('socket.io').listen(3000, { log: false });

io.sockets.on('connection', function (socket) {
	var disc = false;
	socket.on('disconnect', function() {
    	disc = true;
    });

	setInterval(function () {
		if (!disc) {
			var track;
			s.currentTrack(function(err, track) {
				if (err) {
					track = {
						'title': null
					};
				}
				else {
					s.getZoneAttrs(function(err,data) {
						track.currentZone = data.CurrentZoneName;
						s.getVolume(function(err,volume) {
							track.volume = volume;
							s.currentState(function(err, state) {
								track.state = state;
								io.sockets.emit('sonos', track);
							});
						});
					});
				}
			});
		}
	}, 500);
});



function CurrentTrack(req,res) {
	var track;
	s.currentTrack(function(err, track) {
		if (err) {
			track = {
				'title': null
			};
		}
		else {
			s.getZoneAttrs(function(err,data) {
				track.currentZone = data.CurrentZoneName;
				s.getVolume(function(err,volume) {
					track.volume = volume;
					s.currentState(function(err, state) {
						track.state = state;
						res.send(track);
					});
				});
			});
		}
	});
}

function Control(req, res) {
	tmp = req.body;
	console.log('Control ' + req.body.type);
	if (tmp.type == "pause") {
		s.pause(function(err, paused) {
			console.log('pausing');
		});
	}
	else if (tmp.type == "play") {
		s.play(function(err, playing) {
			console.log('playing');
		});	
	}
	else if (tmp.type == "stop") {
		s.stop(function(err, stopped) {
			console.log('stopping');
		});	
	}
	else if (tmp.type == "voldown" || tmp.type == "volup") {
		s.getVolume(function(err, volume) {
			if (tmp.type == "voldown") {
					s.setVolume(volume-10, function(err, data) {
				});
			}
			else {
				s.setVolume(volume+10, function(err, data) {
				});		
			}

		});
		res.send(true);
	}
	else {
		res.send(false);
	}
	
}

exports.CurrentTrack = CurrentTrack;
exports.Control = Control;