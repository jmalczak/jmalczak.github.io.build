window.requirejs.config({
    baseUrl: '/js',
    paths: {
        jquery: '../_bower_components/jquery/jquery.min',
        bootstrap: '../_bower_components/bootstrap/dist/js/bootstrap.min',
        ekkolightbox: '../_bower_components/ekko-lightbox/dist/ekko-lightbox',
        mapbox: '../_bower_components/mapbox.js/mapbox',
        knockout: '../_bower_components/knockout/dist/knockout',
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
        },
        knockout : {
            exports: 'ko'
        }

    }
});

window.requirejs(['shared/console', 'shared/details', 'shared/lightbox'], function(console, details, lightbox){
    console.init();
    lightbox.init();
});
