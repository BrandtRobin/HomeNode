var ViewModel = function () {
    var self = this;
    self.groups = ko.observableArray([]);
    console.log('loading Index viewmodel');
    self.temperature = ko.observable('waiting for sensor..');
    self.nodeserver;
    self.tmpfloat = 0;

    self.getconfig = function () {
        $("document").ready(function () {
            $.getJSON("getconfiguration", function (data) {
                self.nodeserver = data.nodeserver;
                self.gettemps();
            });
        });
    };

    self.gettemps = function () {
        var socket = io.connect('http://' + self.nodeserver + ':3001');
        console.log('connecting socket 3001');
        socket.on('temperature', function (value, name) {
            console.log(name + ' : ' + value);
            self.temperature(name + ' ' + value);
            self.tmpfloat = parseFloat(value);
            var point = chart.series[0].points[0];
            point.update(self.tmpfloat);
        });
    };

    self.controlsonos = function (input) {
        console.log(input);
        data = {
            'type': input
        };
        $.ajax({
            type: "POST",
            url: "controlsonos",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
                if (!data) {
                    console.log('no valid input given to control');
                }
            }
        });
    };

    self.loadGroups = function () {
        $("document").ready(function () {
            $.getJSON("groups", function (data) {
                self.groups(data);
            });
        });
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
        return true;
    };

    self.loadgauge = function() {
        // $('#gauge').highcharts({
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'gauge1',
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            
            title: {
                text: ''
            },
            
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },
               
            // the value axis
            yAxis: {
                min: -30,
                max: 50,
                
                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',
        
                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: ''
                },
                plotBands: [{
                    from: -30,
                    to: 0,
                    color: '#55BF3B' // green
                }, {
                    from: 0,
                    to: 20,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 20,
                    to: 50,
                    color: '#DF5353' // red
                }]        
            },
        
            series: [{
                name: 'Temperature',
                data: [0],
            }],
        });
    };

    (function () {
        self.getconfig();
        self.loadGroups();
        self.loadgauge();
    }(self));
};
