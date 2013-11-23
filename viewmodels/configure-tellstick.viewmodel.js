var ViewModel = function () {
  var self = this;

  console.log('loading Configure viewmodel');
  self.units = ko.observableArray([]);
  self.upTime = ko.observable(null);
  self.downTime = ko.observable(null);
  self.newId = ko.observable(null);
  self.newName = ko.observable(null);
  self.AutoState = ko.observable('Laddar...');
  self.lat = ko.observable('Laddar...');
  self.lon = ko.observable('Laddar...');
  self.choosensync = ko.observable('Ingen enhet vald.');
  self.syncmodalval = ko.observable(null);

  
  self.loadUnits = function() {
    $("document").ready(function() {
      $.getJSON("units", function(data) {
        self.units(data);
      });
    });
  };

  self.syncunit = function(unit) {
    self.choosensync('Synkronisera enhet ' + unit._id);
    self.syncmodalval(unit._id);
  };

  self.sendsync = function() {
    tmp = {
      _id:self.syncmodalval()
    };
    $.ajax({
      type: "POST",
      url: "syncunit", // your POST target goes here
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(tmp), // message to send goes here
      success: function (data)
      {
        console.log(data);
        if (data) {
          $('#loadingModal').modal('show');
          setTimeout(function() {
          $('#loadingModal').modal('hide');}, 3000);
        }
      }
    });
  };

  self.updateConf = function() {
      $.ajax({
        type: "POST",
        url: "updateconfig", // your POST target goes here
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(self.units()), // message to send goes here
        success: function (data)
        {
          if (data) {
            $('#loadingModal').modal('show');
            setTimeout(function() {
            $('#loadingModal').modal('hide');}, 5000);
          }
          if (!data) {
            console.log('Could not write to configfile! Not restarting telldus.')
          }
        }
      });
  };

  self.warningModal = function(unit) {
    $('#removalModal').modal('show');
    self.toRemove = unit._id;
  };

  self.deleteUnit = function() {
      data = {
        _id:self.toRemove
      };
      $.ajax({
        type: "POST",
        url: "deleteunit", // your POST target goes here
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data), // message to send goes here
        success: function (data)
        {
          self.toRemove = "";
          $('#removalModal').modal('hide');
          self.loadUnits();
        }
      });
  };

  self.addUnit = function() {
    document.getElementById("addForm").reset();
    if (self.newId() === null || self.newName() === null) {
      console.log('add warning here!');
      //Reset values
      self.newId(null);
      self.newName(null);
    }
    else {
      data = {
        _id:self.newId(),
        name:self.newName(),
        state:false
      };
      $.ajax({
        type: "POST",
        url: "add", // your POST target goes here
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data), // message to send goes here
        success: function (data)
        {
          self.newId(null);
          self.newName(null);
          self.loadUnits();
        }
      });
    }
  };

  (function () {
    self.loadUnits();
  } (self));
};