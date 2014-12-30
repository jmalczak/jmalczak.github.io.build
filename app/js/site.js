define(['jquery'],function($){
    var Site = function(){
        var self = this;

        self.settings = {
            slideDownSelector: '#slideDown',
            contentSelector: '.content'
        };

        self.init = function(){
            self.initEvents();
        };

        self.initEvents = function(){
            $(self.settings.slideDownSelector).click(function() {
                $('html, body').animate({
                    scrollTop: $(self.settings.contentSelector).offset().top
                }, 700);
            });
        };
    };

    return new Site();
});