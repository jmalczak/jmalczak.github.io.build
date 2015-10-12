window.requirejs(['main'], function(common) {
    require(['jquery', 'mapbox', 'map/map-markers', 'knockout'], function($, L, M, ko) {

        var Map = function() {
            var self = this;

            self.settings = {
                accessToken: 'pk.eyJ1IjoibWFsY3p1IiwiYSI6IjYwNWI0ZjI3YmM4OTA1ZGU1ODMwZTJiNGFmZDA1Nzc2In0.IIXH9EyewmF5-_1iEgsLOA',
                mapName: 'mapbox.light',
                containerName: 'map'
            };

            self.init = function() {
                self.initEvents();
            };

            self.initEvents = function() {
                $(document).ready(function () {
                    ko.applyBindings(M);
                    self.configureMapBox();
                });
            };

            self.configureMapBox = function() {
                L.mapbox.accessToken = self.settings.accessToken;
                
                self.map = L.mapbox.map(
                    self.settings.containerName,
                    self.settings.mapName, {
                        zoomControl: false,
                        scrollWheelZoom: false,
                        attributionControl: {compact: true}
                    }).setView([40,25], 3);

                self.addMarkers();
            };

            self.addMarkers = function() {
                M.continents.forEach(function(continent) {
                    continent.countries.forEach(function(country) {
                        L.marker([country.lat, country.lon], {title: country.name}).addTo(self.map);
                    });
                });
            };
        };
        var i = new Map();
        i.init();
    });
});
