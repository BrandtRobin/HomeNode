var ViewModel = function () {
	var self = this;

	console.log('loading Configure viewmodel');
	self.units = ko.observableArray([]);
	self.groups = ko.observableArray([]);
	self.upTime = ko.observable(null);
	self.downTime = ko.observable(null);
	self.newId = ko.observable(null);
	self.newName = ko.observable(null);
	self.AutoGroup = ko.observable(null);
	self.ManUpTime = ko.observable();
	self.ManDownTime = ko.observable();
	self.ManUpStatus = ko.observable();
	self.ManDownStatus = ko.observable();
	self.AutoUpStatus = ko.observable();
	self.AutoDownStatus = ko.observable();
	self.lat = ko.observable('Laddar...');
	self.lon = ko.observable('Laddar...');

	self.loadUnits = function () {
		$("document").ready(function () {
			$.getJSON("units", function (data) {
				self.units(data);
			});
		});
	};

	self.setManualTime = function () {
		console.log(self.ManUpTime());
		console.log(self.ManUpStatus());
	}

	self.loadGroups = function () {
		$("document").ready(function () {
			$.getJSON("groups", function (data) {
				self.groups(data);
			});
		});
	};

	self.ChangeManAuto = function (data) {
		switch (data) {
			//Avstängning
			case 'AutoUpStatus':
				if (self.AutoUpStatus()) {
					self.AutoUpStatus(false);
					self.ManUpStatus(false);
				}
				else if (!self.AutoUpStatus()) {
					self.AutoUpStatus(true);
					self.ManUpStatus(false);
				}

				break;
			case 'ManUpStatus':
				if (self.ManUpStatus()) {
					self.AutoUpStatus(false);
					self.ManUpStatus(false);
				}
				else if (!self.ManUpStatus()) {
					self.AutoUpStatus(false);
					self.ManUpStatus(true);
				}
				break;
			//Påslagning
			case 'AutoDownStatus':
				if (self.AutoDownStatus()) {
					self.AutoDownStatus(false);
					self.ManDownStatus(false);
				}
				else if (!self.AutoDownStatus()) {
					self.AutoDownStatus(true);
					self.ManDownStatus(false);
				}

				break;
			case 'ManDownStatus':
				if (self.ManDownStatus()) {
					self.AutoDownStatus(false);
					self.ManDownStatus(false);
				}
				else if (!self.ManDownStatus()) {
					self.AutoDownStatus(false);
					self.ManDownStatus(true);
				}
				break;
		}
	};

	self.SaveChangeManAuto = function () {
		data = {
			ManDownTime: self.ManDownTime(),
			ManUpTime: self.ManUpTime(),
			manUpActive: self.ManUpStatus(),
			manDownActive: self.ManDownStatus(),
			autoUpActive: self.AutoUpStatus(),
			autoDownActive: self.AutoDownStatus(),
		};
		$.ajax({
			type: "POST",
			url: "savechangemanauto",
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (data) {
				if (data) {
					$('#loadingModal').modal('show');
					setTimeout(function () {
						$('#loadingModal').modal('hide');
					}, 3000);
					self.loadConf();
				}
				if (!data) {
					console.log('savechangemanauto write error')
				}
			}
		});
	};

	self.ChangeAutoGroup = function (group) {
		console.log('changing autogroup to: ' + group._id);
		data = {
			group: group._id
		};
		$.ajax({
			type: "POST",
			url: "changeautogroup", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data), // message to send goes here
			success: function (data) {
				if (data) {
					$('#loadingModal').modal('show');
					setTimeout(function () {
						$('#loadingModal').modal('hide');
					}, 3000);
					self.loadConf();
				}
				if (!data) {
					console.log('autogroup write error')
				}
			}
		});
	};

	self.updateCoordinates = function () {
		data = {
			lat: self.lat(),
			lon: self.lon()
		};
		$.ajax({
			type: "POST",
			url: "updatecoords",
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (data) {
				if (data) {
					$('#loadingModal').modal('show');
					setTimeout(function () {
						$('#loadingModal').modal('hide');
					}, 3000);
				}
				if (!data) {
					console.log('Lat long write error')
				}
			}
		});
	};

	self.gmap = function () {
		$("document").ready(function () {
			$.getJSON("conf", function (data) {
				var addresspicker = $("#addresspicker").addresspicker();
				var addresspickerMap = $("#addresspicker_map").addresspicker(
					{
						regionBias: "se",
						map: "#map_canvas",
						typeaheaddelay: 1000,
						mapOptions: {
							zoom: 16,
							streetViewControl: false,
							center: new google.maps.LatLng(data[0].lat, data[0].lon)
						}
					});

				addresspickerMap.on("addressChanged", function (evt, address) {
					console.log(address.geometry.location.lat() + "," + address.geometry.location.lng())
					console.log(address);
					self.lat(address.geometry.location.lat());
					self.lon(address.geometry.location.lng());
				});
				addresspickerMap.on("positionChanged", function (evt, markerPosition) {
					markerPosition.getAddress(function (address) {
						if (address) {
							$("#addresspicker_map").val(address.formatted_address);
						}
					});
				});
			});
		});
	};

	self.loadConf = function () {
		$("document").ready(function () {
			$.getJSON("conf", function (data) {
				self.upTime(data[0].upHour + ':' + data[0].upMinute);
				self.downTime(data[0].downHour + ':' + data[0].downMinute);
				self.lat(data[0].lat);
				self.lon(data[0].lon);
				self.AutoGroup(data[0].group);
				self.ManUpTime(data[0].manupHour + ':' + data[0].manupMinute);
				self.ManDownTime(data[0].mandownHour + ':' + data[0].mandownMinute);
				self.ManUpStatus(data[0].manUpActive);
				self.ManDownStatus(data[0].manDownActive);
				self.AutoDownStatus(data[0].autoDownActive);
				self.AutoUpStatus(data[0].autoUpActive);
			});
		});
	};

	(function () {
		self.loadUnits();
		self.loadGroups();
		self.loadConf();
		//self.getAutoValue();
		self.gmap();
	}(self));
};