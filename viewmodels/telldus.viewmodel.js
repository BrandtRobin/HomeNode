var ViewModel = function () {
	var self = this;

	console.log('loading Index viewmodel');
	self.units = ko.observableArray([]);
	self.groups = ko.observableArray([]);

	self.loadUnits = function () {
		//$('#loadingModal').modal('show');
		$("document").ready(function () {
			$.getJSON("units", function (data) {
				self.units(data);
				//$('#loadingModal').modal('hide');
				//$('#loading').hide();
			});
		});
	};

	self.loadGroups = function () {
		//$('#loadingModal').modal('show');
		$("document").ready(function () {
			$.getJSON("groups", function (data) {
				self.groups(data);
				//$('#loadingModal').modal('hide');
				//$('#loading').hide();
			});
		});
	};

	self.toggleUnit = function (unit) {
		console.log('toggle unit ' + JSON.stringify(unit._id));
		$.ajax({
			type: "POST",
			url: "toggle", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(unit), // message to send goes here
			success: function (data) {
				$('#loadingModal').modal('show');
				setTimeout(function () {
					$('#loadingModal').modal('hide');
				}, 3000);
			}
		});
		self.loadUnits();
		return true;
	};

	self.toggleGroupOn = function (group) {
		data = {
			group: group._id,
			state: true
		};
		$.ajax({
			type: "POST",
			url: "all", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data), // message to send goes here
			success: function (data) {
				$('#loadingModal').modal('show');
				setTimeout(function () {
					$('#loadingModal').modal('hide');
				}, 3000);
				self.loadUnits();
			}
		});
		return true;
	};

	self.toggleGroupOff = function (group) {
		data = {
			group: group._id,
			state: false
		};
		$.ajax({
			type: "POST",
			url: "all", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data), // message to send goes here
			success: function (data) {
				$('#loadingModal').modal('show');
				setTimeout(function () {
					$('#loadingModal').modal('hide');
				}, 3000);
			}
		});
		self.loadUnits();
		return true;
	};

	(function () {
		self.loadUnits();
		self.loadGroups();
	}(self));
};
