module Strings {

    export function GetTagValue(str: string, tag: string = " "): NamedValue<string> {
        if (!str) {
            return new NamedValue<string>();
        } else {
            return tagValueImpl(str, tag);
        }
    }

    function tagValueImpl(str: string, tag: string): NamedValue<string> {
        var i: number = str.indexOf(tag);
        var tagLen: number = Len(tag);

        if (i > -1) {

            var name: string = str.substr(0, i);
            var value: string = str.substr(i + tagLen);

            return <NamedValue<string>>{
                name: name,
                value: value
            };

        } else {
            return <NamedValue<string>>{
                name: "",
                value: str
            };
        }
    }

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

    /**
     * 将字符串转换为字符数组
     * 
     * > https://jsperf.com/convert-string-to-char-code-array/9
     * 经过测试，使用数组push的效率最高
    */
    export function ToCharArray(str: string): string[] {
        var cc: string[] = [];
        var strLen: number = str.length;

        for (var i = 0; i < strLen; ++i) {
            cc.push(str.charAt(i));
        }

        return cc;
    }

    export function Len(s: string): number {
        if (!s || s == undefined) {
            return 0;
        } else {
            return s.length;
        }
    }

    export function CompareTo(s1: string, s2: string): number {
        var l1 = Strings.Len(s1);
        var l2 = Strings.Len(s2);
        var minl = Math.min(l1, l2);

        for (var i: number = 0; i < minl; i++) {
            var x = s1.charCodeAt(i);
            var y = s2.charCodeAt(i);

            if (x > y) {
                return 1;
            } else if (x < y) {
                return -1;
            }
        }

        if (l1 > l2) {
            return 1;
        } else if (l1 < l2) {
            return -1;
        } else {
            return 0;
        }
    }
}