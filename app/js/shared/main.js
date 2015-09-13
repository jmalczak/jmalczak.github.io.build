requirejs.config({
    baseUrl: '/js/shared',
    paths: {
        jquery: '../../_bower_components/jquery/jquery',
        bootstrap: '../../_bower_components/bootstrap/dist/js/bootstrap',
        ekkolightbox: '../../_bower_components/ekko-lightbox/dist/ekko-lightbox',
        mapbox: '../../_bower_components/mapbox.js/mapbox',
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        ekkolightbox: {
            deps: ['bootstrap'],
            exports: 'ekkolightbox'
        },
        mapbox : {
            exports: 'L'
        }
    }
});

requirejs(['console', 'details', 'lightbox'], function(console, details, lightbox){
    console.init();
    lightbox.init();
});
