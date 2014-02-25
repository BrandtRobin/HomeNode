var mongoose = require('mongoose');
var temperature = mongoose.model('Temperature');
var fs = require('fs');

self.numToPurge = 10;
var startdate = new Date();
var startday = startdate.getDay();

function purgedb() {
    setTimeout(function () {
        var curdate = new Date();
        curday = curdate.getDay();
        console.log('startday: ' + startday + ' curday: ' + curday);
        if (curday != startday) {
            console.log('purging db static beyond 10 days');
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            var day = d.getDate()-self.numToPurge;
            var purgedate = year + '-' + month + '-' + day;
            console.log('change! ' + purgedate);
            // fs.appendFile('./temp.log', 'dbpurge ' + purgedate + '\n', function (err) {
            // });
            temperature.remove({date:purgedate}, function(err) {
                startday = curday;
            });

        }
        purgedb();
    }, 3600000);
// }, 10000);
}
purgedb();