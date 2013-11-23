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
  self.latloncheck = ko.observable('Ange 9 tecken, tex 59.274302');

  self.loadUnits = function() {
    $("document").ready(function() {
      $.getJSON("units", function(data) {
        self.units(data);
      });
    });
  };

  self.updateCoordinates = function() {
    data = {
      lat:self.lat(),
      lon:self.lon()
    };
      $.ajax({
        type: "POST",
        url: "updatecoords", // your POST target goes here
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data), // message to send goes here
        success: function (data)
        {
          if (data) {
            $('#loadingModal').modal('show');
            setTimeout(function() {
            $('#loadingModal').modal('hide');}, 3000);
          }
          if (!data) {
            console.log('Lat long write error')
          }
        }
      });
  };

  self.gmap = function() {
    $("document").ready(function() {
      $.getJSON("times", function(data) {
        var addresspicker = $( "#addresspicker" ).addresspicker();
        var addresspickerMap = $( "#addresspicker_map" ).addresspicker(
          {
            regionBias: "se",
            map: "#map_canvas",
            typeaheaddelay: 1000,
            mapOptions: {
              zoom:16,
              streetViewControl:false,
              center: new google.maps.LatLng(data[0].lat, data[0].lon)
            }
          });

        addresspickerMap.on("addressChanged", function(evt, address) {
           console.log(address.geometry.location.lat() +"," + address.geometry.location.lng())
           console.log(address);
           self.lat(address.geometry.location.lat());
           self.lon(address.geometry.location.lng());
        });
        addresspickerMap.on("positionChanged", function(evt, markerPosition) {
            markerPosition.getAddress( function(address) {
                if (address) {
                    $( "#addresspicker_map").val(address.formatted_address);
                }
            });
        });
      });
    });
  };

  // self.checkLatLon = function() {
  //   self.state = ko.observable(false);
  //   if (self.lat().length == 9 && self.lon().length == 9) {
  //     self.latloncheck('Koordinaterna är giltiga.');
  //     self.state(false);
  //   }
  //   else {
  //     self.latloncheck('Ange 9 tecken, tex 59.274302');
  //     self.state(true);
  //   }
  // };

  self.loadTimes = function() {
    $("document").ready(function() {
      $.getJSON("times", function(data) {
        self.upTime(data[0].upHour + ':' + data[0].upMinute);
        self.downTime(data[0].downHour + ':' + data[0].downMinute);
        self.lat(data[0].lat);
        self.lon(data[0].lon);
      });
    });
  };

  //RUNS AT LOAD
  self.getAutoValue = function() {
    $("document").ready(function() {
      $.getJSON("getauto", function(data) {
        if (data) {
          self.AutoState('Aktiverat');
        }
        if (!data) {
          self.AutoState('Inte Aktiverat'); 
        }
      });
    }); 
  };

  //RUNS ON TOGGLE
  self.toggleAutomaticTime = function() {
    $("document").ready(function() {
      $.getJSON("toggleauto", function(data) {
        if (data) {
          self.AutoState('Aktiverat');
        }
        if (!data) {
          self.AutoState('Inte Aktiverat'); 
        }
      });
    }); 
  };
  
  (function () {
    self.loadUnits();
    self.loadTimes();
    self.getAutoValue();
    //self.checkLatLon();
    self.gmap();
  } (self));
};