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
        //console.log('startday: ' + startday + ' curday: ' + curday);
        if (curday != startday) {
            var d = new Date();
            d.setDate(d.getDate() - self.numToPurge);
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            var day = d.getDate();
            var purgedate = year + '-' + month + '-' + day;
            console.log('purgedate is: ' + purgedate);
            // fs.appendFile('./temp.log', 'dbpurge ' + purgedate + '\n', function (err) {
            // });
            temperature.remove({date: {$lte:purgedate}}, function(err) {
                startday = curday;
            });
        }
        purgedb();
    }, 3600000);
// }, 10000);
}
// purgedb();