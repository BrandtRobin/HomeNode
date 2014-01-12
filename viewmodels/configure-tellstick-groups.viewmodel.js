var ViewModel = function () {
	var self = this;

	console.log('loading Configure viewmodel');
	self.groups = ko.observableArray([]);
	self.units = ko.observableArray([]);
	self.members = ko.observableArray([]);
	self.newId = ko.observable(null);
	self.newName = ko.observable(null);
	self.groupMembers = ko.observable('No units selected');

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

	self.loadUnits = function () {
		$("document").ready(function () {
			$.getJSON("units", function (data) {
				self.units(data);
			});
		});
	};

	self.addMember = function (unit) {
		if (self.members.indexOf(unit._id) >= 0) {
			var i = self.members.indexOf(unit._id);
			self.members.splice(i, 1);
			self.members.sort();
			self.groupMembers('Selected ' + self.members());
		}
		else {
			self.members.push(unit._id);
			self.members.sort();
			self.groupMembers('Selected ' + self.members());
		}
		if (self.members().length == 0) {
			self.groupMembers('No units selected');
		}
	};

	self.warningModal = function (group) {
		$('#removalModal').modal('show');
		self.toRemove = group._id;
	};

	self.deleteGroup = function () {
		data = {
			_id: self.toRemove
		};
		$.ajax({
			type: "POST",
			url: "deletegroup", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data), // message to send goes here
			success: function (data) {
				self.toRemove = "";
				$('#removalModal').modal('hide');
				self.loadGroups();
			}
		});
	};

	self.addGroup = function () {
		document.getElementById("addForm").reset();
		if (self.newId() === null || self.newName() === null) {
			console.log('add warning here!');
			//Reset values
			self.newId(null);
			self.newName(null);
		}
		else {
			data = {
				_id: self.newId(),
				name: self.newName(),
				members: self.members()
			};
			$.ajax({
				type: "POST",
				url: "addgroup", // your POST target goes here
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(data), // message to send goes here
				success: function (data) {
					self.newId(null);
					self.newName(null);
					self.loadGroups();
					self.groupMembers('No units selected');
				}
			});
		}
		self.members([]);
	};

	(function () {
		self.loadGroups();
		self.loadUnits();
	}(self));
};