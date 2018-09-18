namespace csv {

    /**
     * 将对象序列转换为``dataframe``对象
     * 
     * 这个函数只能够转换object类型的数据，对于基础类型将不保证能够正常工作
     * 
     * @param data 因为这个对象序列对象是具有类型约束的，所以可以直接从第一个
     *    元素对象之中得到所有的属性名称作为csv文件头的数据
    */
    export function toDataFrame<T>(data: IEnumerator<T>): dataframe {
        var header: IEnumerator<string> = $ts(Object.keys(data.First));
        var rows = data.Select(obj => {
            return header.Select((ref, i) => {
                return toString(obj[ref]);
            });
        });
    }

    function toString(obj: any): string {
        if (isN)
    }
}