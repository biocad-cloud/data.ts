module Strings {

    /**
     * 判断给定的字符串是否是空值？
     * 
     * @param stringAsFactor 假若这个参数为真的话，那么字符串``undefined``也将会被当作为空值处理
    */
    export function Empty(str: string, stringAsFactor = false): boolean {
        if (!str) {
            return true;
        } else if (str == undefined) {
            return true;
        } else if (str.length == 0) {
            return true;
        } else if (stringAsFactor && str.toString() == "undefined") {
            return true;
        } else {
            return false;
        }
    }

    export function IsPattern(str: string, pattern: RegExp): boolean {
        var match: string = str.match(pattern)[0];
        var test: boolean = match == str;

        return test;
    }

    /**
     * Remove duplicate string values from JS array
     * 
     * https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    */
    export function uniq(a: string[]): string[] {
        var seen = {};

        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
}