requirejs(['main'], function(common) {
    require(['jquery', 'mapbox'], function($, L) {
        var Map = function() {
            var self = this;

            self.settings = {
                accessToken: 'pk.eyJ1IjoibWFsY3p1IiwiYSI6IjYwNWI0ZjI3YmM4OTA1ZGU1ODMwZTJiNGFmZDA1Nzc2In0.IIXH9EyewmF5-_1iEgsLOA',
                mapName: 'mapbox.streets',
                containerName: 'map'
            };

            self.init = function() {
                self.initEvents();
            };
            self.initEvents = function() {
                $(document).ready(function () {
                   L.mapbox.accessToken = self.settings.accessToken;
                   self.map = L.mapbox.map(self.settings.containerName, self.settings.mapName, { zoomControl: false });

                   L.marker([45,62]).addTo(self.map);

                   for(var i = 1; i < 20; i++) {
                       var lat = i * 4 + 10;
                       var lon = i * 4 + 10;

                        L.marker([lat, lon]).addTo(self.map);
                   }
                });
            };
        };
        var i = new Map();
        i.init();
    });
});
