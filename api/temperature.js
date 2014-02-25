var telldus = require('telldus');
var mongoose = require('mongoose');
var temperature = mongoose.model('Temperature');
var configs = mongoose.model('Config');
var async = require('async');
// Logging to file
var fs = require('fs');

self = this;
self.todb;
self.storedsensors = [];
self.currentsensor;
self.numevents = 0;
self.lasttemp = '';
self.lastname = 'Waiting for sensors..';


var value;
var timestamp;

var io = require('socket.io').listen(3001, { log: false });
io.configure(function () {
    io.set("transports", ["websocket", "xhr-polling"]);
      io.set("polling duration", 20);
});

io.sockets.on('connection', function (socket) {
    io.sockets.emit('temperature', self.lasttemp, self.lastname);
});

getConfiguredSensors = function (req, res) {
    var sensorinfo = {
        sensors: []
    };
    configs.find({_id:1},{_id:false,configuredSensors:true}, function (err, data) {
        if (err) throw err;
        console.log(data[0].configuredSensors);
        async.eachSeries(data[0].configuredSensors, function(obj, callback) {
            temperature.distinct('date', {deviceID:obj.id}, function (err, data) {
                sensorinfo.sensors.push({deviceID:obj.id,name:obj.name,dates:data.reverse()});
                callback();
            });
        },function(err) {
            //The async sometimes sens the deviceID's in reverse order, sort them here..
            console.log('sending ' + JSON.stringify(sensorinfo));
            res.send(sensorinfo);
        });
    });  
}

changeConfiguredSensor = function (req, res) {
  if (req.body.command == "del") {
    // console.log('deleting ' + JSON.stringify(req.body));
    configs.update({_id:1},{$pull: {configuredSensors: {id:req.body.deviceID}}}, function (err, data) {
        if (err) throw err;
        res.send(true);
    });
  }
  else if (req.body.command == "add") {
    // console.log('adding ' + JSON.stringify(req.body));
    configs.update({_id:1},{$push: {configuredSensors:{name:req.body.name,id:req.body.deviceID}}}, function (err, data) {
      if (err) throw err;
      res.send(true);
    });
  }
}

getDates = function (req, res) {
    console.log(req.body.deviceID);
    temperature.distinct('date', {deviceID:req.body.deviceID}, function (err, data) {
        console.log(data);
        res.send(data);
    });
}

gettemperature = function (req, res) {
  //console.log(req.body);
  // self.d = new Date();
  // self.year = self.d.getFullYear();
  // self.month = self.d.getMonth()+1;
  // self.day = self.d.getDate();
  // self.toDBtoday = self.year+'-'+self.month+'-'+self.day;

  //req.body.name contains selected date since we dont know how to send the selected date in the viewmodel func...
  temperature.find({deviceID: req.body.deviceID,date: req.body.name},{_id:false,temperature:true,datetime:true},{sort: {datetime: 1}}, function (err, data) {
    if (err) throw err;
    // console.log(data);
    res.send(data);
  });
}

self.collecttemps = function() {
  // console.log('creating sample listener');
  self.collectlistener = telldus.addSensorEventListener(function(deviceId,protocol,model,type,value,timestamp) {
    if (type == 1) {
      configs.find({_id:1},{_id:false,configuredSensors:true}, function (err, data) {
        if (err) throw err;
        // console.log(JSON.stringify(data[0].configuredSensors[0].id));
        for(var i = 0; i < data[0].configuredSensors.length; i++) {
          self.storedsensors.push(data[0].configuredSensors[i].id);
        }
        // console.log(self.storedsensors);
        if (self.storedsensors.indexOf(deviceId) > -1) {
            //fs.appendFile('./temp.log', value+'\n', function (err) {
            //});
          //console.log('sensor checked: ' + deviceId + ' with temp ' + value);
          self.storedsensors.length = 0;
          self.d = new Date();
          self.year = self.d.getFullYear();
          self.month = self.d.getMonth()+1;
          self.day = self.d.getDate();
          self.toDBtoday = self.year+'-'+self.month+'-'+self.day;
          // console.log(self.numevents);
          //if (value.match(/^[0-9]\d*(\.\d+)?$/)) {
          if (value.match('^-?[0-9]{1,12}(?:\.[0-9]{1,4})?$')) {
            //console.log('pass');
            configs.find({_id:1, configuredSensors: {$elemMatch: {id:deviceId}}},{_id:false,configuredSensors:true}, function (err, data) {
              io.sockets.emit('temperature', value, data[0].configuredSensors[0].name);
                self.lasttemp = value;
                self.lastname = data[0].configuredSensors[0].name;
            });
            if (self.numevents == 30) {
              self.todb = {
                'deviceID': deviceId,
                'date': self.toDBtoday,
                'datetime': timestamp+3600,
                'temperature': value
              };
              // console.log(self.todb);
              temperature.create(self.todb, function (err, data) {
                if (err) throw err;
              });
              self.numevents = 0;
            }
            else {
              self.numevents++;
            }
          }
        }
      }); 
    }
  });
}

self.collecttemps();
exports.gettemperature = gettemperature;
exports.getConfiguredSensors = getConfiguredSensors;
exports.changeConfiguredSensor = changeConfiguredSensor;
exports.getDates = getDates;