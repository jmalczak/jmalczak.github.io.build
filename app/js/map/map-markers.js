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
                        lat: 49.5,
                        lon: 19
                    }]
                }]
            }];
    };

    return new MapMarkers();
});
