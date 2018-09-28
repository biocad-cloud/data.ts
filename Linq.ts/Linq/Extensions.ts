namespace Linq {

    export function EnsureCollection<T>(data: T | T[] | IEnumerator<T>, n = -1): IEnumerator<T> {
        var type = TypeInfo.typeof(data);

        if (type.IsEnumerator) {
            return <IEnumerator<T>>data;
        } else if (type.IsArray) {
            return new IEnumerator<T>(<T[]>data);
        } else {
            return new IEnumerator<T>([<T>data]);
        }
    }

    /**
     * @param n 如果data数据序列长度不足，则会使用null进行补充，n为任何小于data长度的正实数都不会进行补充操作，
     *     相反只会返回前n个元素，如果n是负数，则不进行任何操作
    */
    export function EnsureArray<T>(data: T | T[] | IEnumerator<T>, n = -1): T[] {
        var type = TypeInfo.typeof(data);

        if (type.IsEnumerator) {
            return (<IEnumerator<T>>data).ToArray();
        } else if (type.IsArray) {
            return <T[]>data;
        } else {
            return [<T>data];
        }
    }
}