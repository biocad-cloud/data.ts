module Cookies {

    export function getCookie(cookiename: string): string {
        // Get name followed by anything except a semicolon
        var cookie: string = document.cookie;
        var cookiestring = RegExp("" + cookiename + "[^;]+").exec(cookie);
        var value: string;

        // Return everything after the equal sign, 
        // or an empty string if the cookie name not found
        if (!!cookiestring) {
            value = cookiestring.toString().replace(/^[^=]+./, "");
        } else {
            value = "";
        }

        return decodeURIComponent(value);
    }

    export function delCookie(name: string): void {
        var cval: string = getCookie(name);
        var exp: Date = new Date();

        exp.setTime(exp.getTime() - 1);

        if (cval != null) {
            var expires: string = (<any>exp).toGMTString();

            expires = `${name}=${cval};expires=${expires}`;
            document.cookie = expires;
        }
    }
}