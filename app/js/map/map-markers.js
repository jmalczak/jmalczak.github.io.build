define(function() {
    var MapMarkers = function() {
        var self = this;

        self.continents = [{
            name: 'Europe',
            img: 'europe.png',
            countries: [{
                    name: 'Poland',
                    lat: 52.2167,
                    lon: 21.0333,
                    description: 'I live in third largest city in Poland called Lodz'
                }, {
                    name: 'Germany',
                    lat: 51.75925,
                    lon: 19.45598,
                    description: 'Just Berlin for a weekend'
                }, {
                    name: 'Austria',
                    lat: 48.2000,
                    lon: 16.3500,
                    description: 'Vienna for a weekend'
                }, {
                    name: 'Hungary',
                    lat: 47.4333,
                    lon: 19.2500,
                    description: 'Budapest during Balkan trip'
                }, {
                    name: 'Serbia',
                    lat: 44.8000,
                    lon: 20.4667,
                    description: 'Belgrade during Balkan trip'
                }, {
                    name: 'Montenegro',
                    lat: 42.7833,
                    lon: 19.4667,
                    description: 'Zablijak, Podgorica, Kotor during Balkan trip'
                }, {
                    name: 'Croatia',
                    lat: 45.8000,
                    lon: 16.0000,
                    description: 'Dubrownik, Split, Plitvice, Zagreb during Balkan trip'
                }, {
                    name: 'Greece',
                    lat: 39.0000,
                    lon: 22.0000,
                    description: 'Crete and Santorini islands'
                }, {
                    name: 'Italy',
                    lat: 41.9000,
                    lon: 12.4833,
                    description: 'Turin, Genoa, Venice, Rome during two different trips'
                }, {
                    name: 'Switzerland',
                    lat: 46.8333,
                    lon: 8.3333,
                    description: 'Zermatt, Matternhorn climb trip'
                }, {
                    name: 'France',
                    lat: 47.0000,
                    lon: 2.0000,
                    description: 'Just Paris'
                }, {
                    name: 'Spain',
                    lat: 40.41678,
                    lon: -3.70379,
                    description: 'Barcelona, Valencia, Madrid, Zaragoza during Spain road trip'
                }, {
                    name: 'Andorra',
                    lat: 42.50628,
                    lon: 1.52180,
                    description: 'Andorra la Vella for some tax free goodies'
                }, {
                    name: 'England',
                    lat: 52.35552,
                    lon: -1.17432,
                    description: 'Studying and working abroad (Coventry, Northampton) for a while',
                }, {
                    name: 'Ireland',
                    lat: 53.41291,
                    lon: -8.24389,
                    description: 'Galway, Dublin, Tralee and couple of smaller places'
                }, {
                    name: 'Sweden',
                    lat: 60.12816,
                    lon: 18.64350,
                    description: 'Stockholm for a couple of days'
                }, {
                    name: 'Finland',
                    lat: 61.92411,
                    lon: 25.74815,
                    description: 'Helsinki one day trip from Sweden'
                }, {
                    name: 'Lithuania',
                    lat: 55.16944,
                    lon: 23.88127,
                    description: 'Vilnius'
                }, {
                    name: 'Latvia',
                    lat: 56.87964,
                    lon: 24.60319,
                    description: 'Riga'
                }, {
                    name: 'Estonia',
                    lat: 58.59527,
                    lon: 25.01361,
                    description: 'Tallin'
                }]
            }, {
            name: 'Asia',
            img: 'asia.png',
            countries: [{
                    name: 'Nepal',
                    lat: 28.39486,
                    lon: 84.12401,
                    description: 'Kathmandu, Pokhara and all small places on the Annapurna Circuit trek'
                }, {
                    name: 'India',
                    lat: 20.59368,
                    lon: 78.96288,
                    description: 'Gorakhpur, New Delhi, Agra, Jaipur, Udaipur, Mumbai, Goa, Kerala' +
                                 ' all the way down to Kanyakumari'
                }, {
                    name: 'Sri Lanka',
                    lat: 7.87305,
                    lon: 80.77180,
                    description: 'Colombo, Kandy, Ella, Tissa, Arugam Bay, Trincomalee, Anuradhapura' +
                                 ' Dambulla and Negombo'
                }, {
                    name: 'Indonesia',
                    lat: -0.78927,
                    lon: 113.92133,
                    description: 'Bandung, Pangandaran, Yogyakarta, Bromo, Kawah Ijen' +
                                 ' Gilimanuk, Ubud, Denpasar, Kuta, Lovina, Gili Air, Kuta Lombok'
                }, {
                    name: 'Malaysia',
                    lat: 4.21048,
                    lon: 101.97577,
                    description: 'Kuala Lumpur'
                }, {
                    name: 'Singapore',
                    lat: 1.35208,
                    lon: 103.81984,
                    description: 'Singapore'
                }, {
                    name: 'Thailand',
                    lat: 15.87003,
                    lon: 100.99254,
                    description: 'Bangkok, Krabi, Ko Phi Phi, Chiang Mai'
                }, {
                    name: 'Laos',
                    lat: 19.85627,
                    lon: 102.49550,
                    description: 'Vientiane, Vang Vieng, Luang Prabang and all the way north to China'
                }, {
                    name: 'Vietnam',
                    lat: 14.05832,
                    lon: 108.27720,
                    description: 'Hanoi, Ha-Long Bay, Hoi An, Ho Chi Minh'
                }, {
                    name: 'Cambodia',
                    lat: 12.56568,
                    lon: 104.99096,
                    description: 'Phnom Penh, Siem Reap to see Angkor Wat'
                }, {
                    name: 'Myanmar',
                    lat: 21.91397,
                    lon: 95.95622,
                    description: 'Yangon, Bagan, Mandalay, Kalaw'
                }, {
                    name: 'China',
                    lat: 35.86166,
                    lon: 104.19540,
                    description: 'Hong Kong, Macau, Guilin, Changsha, Shanghai, Beijing, Xishuangbanna' +
                                 ' Kunming, Dali, Lijiang, ShangriLa, Chengdu, Chongqing'
                }, {
                    name: 'Tibet',
                    lat: 29.64692,
                    lon: 91.11721,
                    description: 'Lhasa, Shigatse, EBC, Namtso Lake'
                }, {
                    name: 'South Korea',
                    lat: 35.90776,
                    lon: 127.76692,
                    description: 'Seoul, DMZ zone, Jeju island, Yeosu, Tongyeong, Busan'
                }, {
                    name: 'Japan',
                    lat: 35.6833,
                    lon: 139.7667,
                    description: 'Fukuoka, Hiroshima'
                }
                ]
            }, {
            name: 'North America',
            img: 'america.png',
            countries: [{
                    name: 'Canada',
                    lat: 56.13037,
                    lon: -106.34677,
                    description: 'Vancouver and Whistler during a weekend trip',
                }, {
                    name: 'United States',
                    lat: 37.09024,
                    lon: -95.71289,
                    description: 'Seattle, Kent and all areas around. Portland, San Francisco and' +
                                 ' Pacific Route number 1 to Los Angeles. Napa valley, Yosemite national' +
                                 ' park. New York.',
                }
            ]}

        ];
    };

    return new MapMarkers();
});
