var configfile = require('./config');
var express = require('express');
var nunjucks  = require('nunjucks');
var mongoose = require('mongoose');
var models = require('./models');
var tdtool = require('./api/tdtool');
var tellstick = require('./api/tellstick-conf');
var sonos = require('./api/sonos.js');
var temperature = require('./api/temperature.js');
var configuration = require('./api/configuration.js');
require('./api/timecheck');
require('./api/dbpurge');

require('express-mongoose')
// SET TO localhost ON DEPLOY
mongoose.connect('mongodb://'+ configfile.mongoserver + '/HomeNode', function (err) {
    if (err) throw err;
    var app = express();
    app.configure(function () {
        app.use(express.logger('dev'));
        app.use(express.static(__dirname));
        app.use(express.bodyParser());
    });
    
    nunjucks.configure('views', {
        autoescape: true,
        express: app
    });

    // STATIC DIRS TO SERVE
    app.use("/scripts", express.static(__dirname + '/scripts'));
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/pics", express.static(__dirname + '/pics'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use("/fonts", express.static(__dirname + '/fonts'));
    app.use("/viewmodels", express.static(__dirname + '/viewmodels'));

    // URLS
    app.get('/units', tdtool.listunits);
    app.get('/groups', tdtool.listgroups);
    app.get('/conf', tdtool.getConf);
    app.post('/toggle', tdtool.toggleone);
    app.post('/all', tdtool.toggleall);
    app.post('/add', tdtool.addunit);
    app.post('/deleteunit', tdtool.deleteunit);
    app.post('/deletegroup', tdtool.deletegroup);
    app.post('/addgroup', tdtool.addgroup);
    app.post('/updateconfig', tellstick.updateConf);
    app.get('/toggleauto', tdtool.toggleauto);
    app.get('/getauto', tdtool.getautovalue);
    app.post('/changeautogroup', tdtool.changeautogroup);
    app.post('/updatecoords', tellstick.updatecoords);
    app.post('/syncunit', tdtool.syncunit);
    app.post('/savechangemanauto', tdtool.savechangemanauto);
    app.get('/currenttrack', sonos.CurrentTrack);
    app.post('/uploadbg', tdtool.uploadbg);
    app.post('/controlsonos', sonos.Control);
    app.post('/updatemap', tdtool.updatemap);
    app.post('/todaystemperature', temperature.gettemperature);
    app.get('/temperaturesensors', temperature.getConfiguredSensors);
    app.post('/changeconfiguredsensor', temperature.changeConfiguredSensor);
    app.post('/getdates', temperature.getDates);
    app.get('/getconfiguration', configuration.sendconfig);

    app.get('/', function(req, res) {
        console.log('request from: ' + req.ip + ' to /');
        res.render('index.htm', { page: 'index' });
    });
    app.get('/telldus', function (req, res) {
        console.log('request from: ' + req.ip + ' to /telldus');
        res.render('telldus.htm', { page: 'telldus' });
    });
    app.get('/telldus-speech', function (req, res) {
        console.log('request from: ' + req.ip + ' to /telldus-speech');
        res.render('telldus-speech.htm', { page: 'telldus-speech' });
    });
    app.get('/configure', function (req, res) {
        console.log('request from: ' + req.ip + ' to /configure');
        res.render('configure-tellstick.htm', { page: 'configure-tellstick' });
    });
    app.get('/configure-groups', function (req, res) {
        console.log('request from: ' + req.ip + ' to /configure-groups');
        res.render('configure-tellstick-groups.htm', { page: 'configure-tellstick-groups' });
    });
    app.get('/configure-auto', function (req, res) {
        console.log('request from: ' + req.ip + ' to /configure-auto');
        res.render('configure-auto.htm', { page: 'configure-auto' });
    });
    app.get('/about', function (req, res) {
        console.log('request from: ' + req.ip + ' to /about');
        res.render('about.htm');
    });
    app.get('/sonos', function (req, res) {
        console.log('request from: ' + req.ip + ' to /sonos');
        res.render('sonos.htm', { page: 'sonos' });
    });
    app.get('/map', function (req, res) {
        console.log('request from: ' + req.ip + ' to /map');
        res.render('map.htm', { page: 'map' });
    });
    app.get('/temperatures', function (req, res) {
        console.log('request from: ' + req.ip + ' to /temperatures');
        res.render('temperature.htm', { page: 'temperature' });
    });
    app.get('/configure-temperatures', function (req, res) {
        console.log('request from: ' + req.ip + ' to /configure-temperatures');
        res.render('configure-temperatures.htm', { page: 'configure-temperatures' });
    });

    app.listen(8787);
    console.log('Listening on port 8787...');
});
