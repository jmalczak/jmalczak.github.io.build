define([], function() {
    var Cookie = function() {
        var self = this;
        self.setCookie = function(name, value, days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "expires=" + date.toGMTString();
            document.cookie = name + '=' + value + ';' + expires + '; path=/';
        };
        self.getCookie = function(name) {
        	var cookie = document.cookie;
        	var cookieList = cookie.split(';');

        	for(var l = 0; l < cookieList.length; l++){
        		while(cookieList[l].charAt(0) == ' '){
        			cookieList[l] = cookieList[l].substring(1, cookieList[l].length)
        		}

        		if(cookieList[l].indexOf(name + '=') == 0){
        			return cookieList[l].substring(name.length + 1, cookieList[l].length);
        		}
        	}
        };
    };
    return new Cookie();
});