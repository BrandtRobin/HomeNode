var ViewModel = function () {
    var self = this;
    console.log('loading temperature viewmodel');
    var datetime = Array();
    var temperature = Array();
    var dataArrayFinal = Array();
    self.recieveddatasize = 0;
    self.sensors = ko.observableArray([]);
    //TMP NAME FOR SENSORS TO DISPLAY
    self.selectedsensor = "Temp sensor";

    self.datepicker = function() {
        // $('#datetimepicker1').datetimepicker({
        //     pickTime: false
        // });
        $('#sandbox-container .input-group.date').datepicker({
            format: "yyyy/mm/dd",
            todayBtn: "linked",
            autoclose: true,
            todayHighlight: true
        });
    };

    self.loadData = function (sensor) {
        // Really ugly to overwrite the name with selcted date.. but hey..
        delete sensor.dates;
        console.log('got: ' + JSON.stringify(sensor));
        self.today = sensor.name.replace(/-/g, '/');
        self.tomorrow = self.today;
        var tmparr = sensor.name.split('-');
        var tmpday = parseInt(tmparr[2]);
        tmpday += 1;
        tmpday = tmpday.toString();
        if (self.tomorrow.length == 8) {
            self.tomorrow = self.tomorrow.slice(0, -1);    
        }
        else if (self.tomorrow.length == 9) {
            self.tomorrow = self.tomorrow.slice(0, -2);
        }
        else {
            console.log('cannot reformat date!');
        }
        self.tomorrow = self.tomorrow + tmpday;
        console.log(self.today + ' : ' + self.tomorrow);
        $.ajax({
            type: "POST",
            url: "todaystemperature",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(sensor),
            success: function (data) {
                self.recieveddatasize = data.length;
                dataArrayFinal.length = 0;
                temperature.length = 0;
                for(i=0;i<data.length;i++) { 
                   datetime[i] = data[i].datetime*1000; 
                   temperature[i] = data[i].temperature;  
                }
                for(j=0;j<datetime.length;j++) { 
                   temp = new Array(datetime[j],temperature[j]); 
                   dataArrayFinal[j] = temp;  
                }
                temp = 0;
                self.drawgraph();
            }
        });
    };

    self.loadConfiguredSensors = function () {
        $("document").ready(function () {
            $.getJSON("temperaturesensors", function (data) {
                // console.log('got: ' + JSON.stringify(data.sensors));
                self.sensors(data.sensors);
                console.log('dates ' + JSON.stringify(self.sensors()[0].dates));
                // self.loadDates();
            });
        });
    };

    self.drawgraph = function () {
        if (self.recieveddatasize == 0) {
            $('#container').highcharts({
                title: {
                    useHTML: true,
                    text: 'No data recorded today from this sensor..'
                }
            });
        }
        else {
            $('#container').highcharts({
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 3600 * 1000,
                    min: new Date(self.today).getTime(),
                    max: new Date(self.tomorrow).getTime(),
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                },
                tooltip: {
                    valueSuffix: '°C',
                    crosshairs: true
                },
                series: [{
                    name: self.selectedsensor,
                    pointStart: Date.UTC(self.today),
                    pointInterval: 24 * 3600 * 1000,
                    data: dataArrayFinal
                }]
            });
            dataArrayFinal = new Array();
            datetime = new Array();
            self.recieveddatasize = 0;
        }
    };

    self.nographchoosen = function () {
        $('#container').highcharts({
            title: {
                useHTML: true,
                text: 'Select a sensor to graph.'
            }
        });
    };
    
    (function () {
        self.loadConfiguredSensors();
        self.nographchoosen();
        self.datepicker();
    }(self));
};
