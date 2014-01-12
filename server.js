var express = require('express');
var mongoose = require('mongoose');
var models = require('./models');
var tdtool = require('./api/tdtool');
var tellstick = require('./api/tellstick-conf');
var sonos = require('./api/sonos.js');
require('./api/timecheck');


require('express-mongoose')
// SET TO localhost ON DEPLOY
mongoose.connect('mongodb://127.0.0.1/HomeNode', function (err) {
    if (err) throw err;
    var app = express();
    app.configure(function () {
        app.use(express.logger('dev'));
        /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.static(__dirname));
        app.use(express.bodyParser());
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
    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/views/index.htm');
    });
    app.get('/telldus', function (req, res) {
        res.sendfile(__dirname + '/views/telldus.htm');
    });
    app.get('/list', function (req, res) {
        res.sendfile(__dirname + '/views/list.htm');
    });
    app.get('/configure', function (req, res) {
        res.sendfile(__dirname + '/views/configure-tellstick.htm');
    });
    app.get('/configure-groups', function (req, res) {
        res.sendfile(__dirname + '/views/configure-tellstick-groups.htm');
    });
    app.get('/configure-auto', function (req, res) {
        res.sendfile(__dirname + '/views/configure-auto.htm');
    });
    app.get('/about', function (req, res) {
        res.sendfile(__dirname + '/views/about.htm');
    });
    app.get('/sonos', function (req, res) {
        res.sendfile(__dirname + '/views/sonos.htm');
    });
    app.get('/map', function (req, res) {
        res.sendfile(__dirname + '/views/map.htm');
    });
    app.get('/test', function (req, res) {
        res.sendfile(__dirname + '/views/test.htm');
    });

    app.listen(8888);
    console.log('Listening on port 8888...');
});