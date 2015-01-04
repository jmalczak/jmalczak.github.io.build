define(['jquery', 'cookie'], function($, cookie) {
    var Site = function() {
        var self = this;
        self.settings = {
            slideDownSelector: '#slideDown',
            contentSelector: '.content'
        };
        self.init = function() {
            self.initEvents();
            self.scrollToContentIfUserIsReturning();
        };
        self.initEvents = function() {
            $(self.settings.slideDownSelector).click(function() {
                self.scrollToContent();
            });
        };
        self.scrollToContent = function() {
            $('html, body').animate({
                scrollTop: $(self.settings.contentSelector).offset().top
            }, 700);
        };
        self.scrollToContentIfUserIsReturning = function(){
            var visitsCookie = cookie.getCookie('visits');

            if(visitsCookie === undefined){
                cookie.setCookie('visits', 1);
            }
            else if( parseInt(visitsCookie) > 3){
                var content = $(self.settings.contentSelector);

                if(content != undefined){
                    document.body.scrollTop = content.offset().top;
                }
            }
            else{
                var numberOfVisits = parseInt(visitsCookie);
                cookie.setCookie('visits', numberOfVisits + 1);
            }
        };
    };
    return new Site();
});