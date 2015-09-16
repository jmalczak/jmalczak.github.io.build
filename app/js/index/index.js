requirejs(['main'], function(common) {
    require(['jquery'], function($) {
        var Index = function() {
            var self = this;
            self.settings = {
                slideDownSelector: '#slideDown', contentSelector: '.content'
            };
            self.init = function() {
                self.initEvents();
            };
            self.initEvents = function() {
                $(document).ready(function () {
                    $(self.settings.slideDownSelector).click(function() {
                        self.scrollToContent();
                    });
                });
            };
            self.scrollToContent = function() {
                $('html, body').animate({
                    scrollTop: $(self.settings.contentSelector).offset().top
                }, 700);
            };
        };
        var i = new Index();
        i.init();
    });
});
