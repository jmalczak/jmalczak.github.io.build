require.config({
    baseUrl: '/js',
    paths: {
        jquery: '../_bower_components/jquery/jquery',
        bootstrap: '../_bower_components/bootstrap/dist/js/bootstrap',
        ekkolightbox: '../_bower_components/ekko-lightbox/dist/ekko-lightbox'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        ekkolightbox: {
            deps: ['bootstrap'],
            exports: 'ekkolightbox'
        }
    }
});

require(['plugins', 'site', 'details', 'lightbox'], function(plugins, site, details, lightbox){
    plugins.init();
    site.init();
    lightbox.init();
});
