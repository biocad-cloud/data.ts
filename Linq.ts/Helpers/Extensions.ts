/**
 * 通用数据拓展函数集合
*/
module DataExtensions {

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

    /**
     * 将URL查询字符串解析为字典对象
     * 
     * @param queryString URL查询参数
     * @param lowerName 是否将所有的参数名称转换为小写形式？
     * 
     * @returns 键值对形式的字典对象
    */
    export function parseQueryString(queryString: string, lowerName: boolean = false): object {
        // stuff after # is not part of query string, so get rid of it
        // split our query string into its component parts
        var arr = queryString.split('#')[0].split('&');
        // we'll store the parameters here
        var obj = {};

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue: string = typeof (a[1]) === 'undefined' ? "true" : a[1];

            if (lowerName) {
                paramName = paramName.toLowerCase();
            }

            // if parameter name already exists
            if (obj[paramName]) {

                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }

                if (typeof paramNum === 'undefined') {
                    // if no array index number specified...
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                } else {
                    // if array index number specified...
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            } else {
                // if param name doesn't exist yet, set it
                obj[paramName] = paramValue;
            }
        }

        return obj;
    }

    /**
     * 尝试将任意类型的目标对象转换为数值类型
     * 
     * @returns 一个数值
    */
    export function as_numeric(obj: any): number {
        if (obj == null || obj == undefined) {
            return 0;
        }

        if (typeof obj === 'number') {
            return <number>obj;
        } else if (typeof obj === 'boolean') {
            if (obj == true) {
                return 1;
            } else {
                return -1;
            }
        } else if (typeof obj == 'undefined') {
            return 0;
        } else if (typeof obj == 'string') {
            if (<string>obj == '') {
                // 将空字符串转换为零
                return 0;
            } else {
                return parseFloat(<string>obj);
            }
        } else {
            return 0;
        }
    }
}