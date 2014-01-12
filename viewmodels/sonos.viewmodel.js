var ViewModel = function () {
    var self = this;

    console.log('loading Sonos viewmodel (looping the currenttrack func)');
    self.title = ko.observable();
    self.artist = ko.observable();
    self.album = ko.observable();
    self.albumArtURL = ko.observable();
    self.currentzone = ko.observable('Internal error or no zone found.');
    self.volume = ko.observable();
    self.position = ko.observable();
    self.duration = ko.observable();
    self.posdur = ko.observable();
    self.state = ko.observable();

    self.currenttrack = function () {
        $("document").ready(function () {
            var socket = io.connect('http://127.0.0.1:3000');
                socket.on('sonos', function (data) {
                self.volume(data.volume+'%');
                self.state(data.state);
                if(data.artist == null) {
                    self.title("Radio / No artist info.");
                    self.artist('');
                    self.album('');
                    self.albumArtURL("/pics/radio.jpg");
                    self.duration(100);
                    self.posdur('Streamar');
                    self.position(100);
                    self.position(self.position()+'%');
                    self.currentzone('Zone: ' + data.currentZone);
                }
                else {
                    self.title('Track: ' + data.title);
                    self.artist('Artist: ' + data.artist);
                    self.album('Album: ' + data.album);
                    self.albumArtURL(data.albumArtURL);
                    self.position(data.position/data.duration);
                    self.duration(data.duration);
                    self.posdur(data.position + ' / ' + data.duration);
                    self.position((data.position / data.duration) * 100);
                    self.position(self.position()+'%');
                    self.currentzone('Zone: ' + data.currentZone);
                }
            });
        });
    };

    self.control = function (input) {
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

    (function () {
        self.currenttrack();
    }(self));
};
