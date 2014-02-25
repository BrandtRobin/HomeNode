var ViewModel = function () {
	var self = this;
	self.sensors = ko.observableArray([]);
	self.sensor = ko.observable();
	self.newId = ko.observable(null);
	self.newName = ko.observable(null);

	console.log('loading Configure temperatures viewmodel');

	self.DelConfiguredSensor = function (sensor) {
		console.log(sensor.deviceID);
		self.sensor(sensor.deviceID);
		sensor.command = 'del';
		$.ajax({
			type: "POST",
			url: "changeconfiguredsensor",
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(sensor),
			success: function (data) {
				self.loadConfiguredSensors();
			}
		});
	};

	self.AddConfiguredSensor = function () {
		document.getElementById("addForm").reset();
		if (self.newId() === null || self.newName() === null) {
			console.log('add warning here!');
			//Reset values
			self.newId(null);
			self.newName(null);
		}
		else {
			data = {
				deviceID: self.newId(),
				name: self.newName(),
				command: 'add',
			};
			$.ajax({
				type: "POST",
				url: "changeconfiguredsensor",
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(data),
				success: function (data) {
					self.newId(null);
					self.newName(null);
					self.loadConfiguredSensors();
				}
			});
		}
	};

	self.loadConfiguredSensors = function () {
		$("document").ready(function () {
			$.getJSON("temperaturesensors", function (data) {
				self.sensors(data.sensors);
				console.log('got: ' + JSON.stringify(data.sensors));
			});
		});
	};

	(function () {
		self.loadConfiguredSensors();
	}(self));
};