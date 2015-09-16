define(function() {
    var MapMarkers = function() {
        var self = this;

        self.continents = [{
            name: "Europe",
            countries: [{ 
                name: "Poland",
                    cities: [{
                        name: "Lodz",
                        description: "Home Town",
                        lat: 51.75925,
                        lon: 19.45598
                    }]
                }, { 
                    name: "Germany",
                    cities: [{
                        name: "Berlin",
                        description: "Berlin",
                        lat: 52.52001,
                        lon: 13.40495
                    }]
                }, {
                    name: "Austria",
                    cities: [{
                        name: "Vienna",
                        description: "Vienna",
                        lat: 48.20817,
                        lon: 16.37382
                    }]
                }, {
                    name: "Hungary",
                    cities: [{
                        name: "Budapest",
                        description: "Budapest",
                        lat: 47.49791,
                        lon: 19.04023
                    }]
                }, {
                    name: "Croatia",
                    cities: [{
                        name: "Zagreb",
                        description: "Zagreb",
                        lat: 45.81501,
                        lon: 15.98192
                    }]
                }, {
                    name: "Czech Republic",
                    cities: [{
                        name: "Prague",
                        description: "Prague",
                        lat: 50.07554,
                        lon: 14.43780
                    }]
                }, {
                    name: "Switzerland",
                    cities: [{
                        name: "Zermatt",
                        description: "Zermatt",
                        lat: 45.96703,
                        lon: 7.69587
                    }]
                }, {
                    name: "France",
                    cities: [{
                        name: "Paris",
                        description: "Paris",
                        lat: 48.85661,
                        lon: 2.35222
                    }]
                }






                ]
            }];
    };

    return new MapMarkers();
});
