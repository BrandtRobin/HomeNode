var sonos = require('sonos');

// IP IF BRIDGE OR CONTROLLING SPEAKER
var sonos_host = '13.37.1.133';
var s = new sonos.Sonos(sonos_host);


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
					// console.log(track);
					res.send(track);
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
	else if (tmp.type == "spotify") {

	}
	else {
		res.send(false);
	}
	
}

exports.CurrentTrack = CurrentTrack;
exports.Control = Control;