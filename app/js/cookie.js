define([], function() {
    var Cookie = function() {
        var self = this;
        self.setCookie = function(name, value, days) {

            if(days === undefined) {
                days = 100;
            }

            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + date.toGMTString();
            document.cookie = name + '=' + value + ';' + expires + '; path=/';
        };
        self.getCookie = function(name) {
            var cookie = document.cookie;
            var cookieList = cookie.split(';');
            var cookieListLength = cookieList.length;

            for(var l = 0; l < cookieListLength; l++){
                var currentCookie = cookieList[l];
                while(currentCookie.charAt(0) === ' '){
                    currentCookie = currentCookie.substring(1, currentCookie.length);
                }

                if(currentCookie.indexOf(name + '=') === 0){
                    return currentCookie.substring(name.length + 1, currentCookie.length);
                }
            }
        };
    };
    return new Cookie();
});