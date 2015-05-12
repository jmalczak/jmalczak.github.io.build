define(['ekkolightbox'], function() {
    var Lightbox = function() {
        var self = this;

        self.init = function() {
            $(document).ready(function() {
                $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
                    event.preventDefault();
                    $(this).ekkoLightbox();
                    $('.ekko-lightbox').css('padding-right', 0)
                }); 
            });
        };
    };

    return new Lightbox();
});
