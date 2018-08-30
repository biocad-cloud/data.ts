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
}