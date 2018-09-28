namespace Linq {

    export function EnsureCollection<T>(data: T | T[] | IEnumerator<T>, n = -1): IEnumerator<T> {
        return new IEnumerator<T>(Linq.EnsureArray(data, n));
    }

    /**
     * @param data 如果这个参数是一个数组，则在这个函数之中会执行复制操作
     * @param n 如果data数据序列长度不足，则会使用null进行补充，n为任何小于data长度的正实数都不会进行补充操作，
     *     相反只会返回前n个元素，如果n是负数，则不进行任何操作
    */
    export function EnsureArray<T>(data: T | T[] | IEnumerator<T>, n = -1): T[] {
        var type = TypeInfo.typeof(data);
        var array: T[];

        if (type.IsEnumerator) {
            array = (<IEnumerator<T>>data).ToArray();
        } else if (type.IsArray) {
            array = [...<T[]>data];
        } else {
            array = [<T>data];
        }

        if (1 <= n) {
            if (n < array.length) {
                array = array.slice(0, n);
            } else if (n > array.length) {
                var len: number = array.length;

                for (var i: number = len; i < n; i++) {
                    array.push(null);
                }
            } else {
                // n 和 array 等长，不做任何事
            }
        }

        return array;
    }
}