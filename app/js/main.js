require.config({
    baseUrl: '/js',
    paths: {
        jquery: '../_bower_components/jquery/jquery'
    }
});

require(['plugins', 'site'], function(plugins, site){
    plugins.init();
    site.init();
});