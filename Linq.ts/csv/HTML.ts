namespace csv.HTML {

    /**
     * 将数据框对象转换为HTMl格式的表格对象的html代码
     * 
     * @param tblClass 所返回来的html表格代码之中的table对象的类型默认是bootstrap类型的，
     * 所以默认可以直接应用bootstrap的样式在这个表格之上
     * 
     * @returns 表格的HTML代码
    */
    export function toHTMLTable(data: dataframe, tblClass: string = ""): string {

    }

    export function createHTMLTable<T>(data: IEnumerator<T>, tblClass: string = ""): string {
        return toHTMLTable(csv.toDataFrame(data), tblClass);
    }
}