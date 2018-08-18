/**
 * http://www.rfc-editor.org/rfc/rfc4180.txt
*/
namespace csv {

    /**
     * Common Format and MIME Type for Comma-Separated Values (CSV) Files
    */
    const contentType: string = "text/csv";

    /**
     * ``csv``文件模型
    */
    export class dataframe extends IEnumerator<csv.row> {

        /**
         * Csv文件的第一行作为header
        */
        public get headers(): IEnumerator<string> {
            return new IEnumerator<string>(this.sequence[0]);
        }

        public constructor(rows: row[]) {
            super(rows);
        }

        public buildDoc(): string {
            return this.Select(r => r.rowLine).JoinBy("\n");
        }

        /**
         * 使用ajax将csv文件保存到服务器
         * 
         * @param url csv文件数据将会被通过post方法保存到这个url所指定的网络资源上面
         * @param callback ajax异步回调，默认是打印返回结果到终端之上
         * 
        */
        public save(
            url: string,
            callback: (response: string) => void =
                (response: string) => {
                    console.log(response);
                }): void {

            var file: string = this.buildDoc();
            var data = <LinqHelpers.PostData>{
                type: contentType,
                data: file
            };

            LinqHelpers.UploadFile(url, data, callback);
        }

        /**
         * 使用ajax GET加载csv文件数据，不推荐使用这个方法处理大型的csv文件数据
         * 
         * @param callback 当这个异步回调为空值的时候，函数使用同步的方式工作，返回csv对象
         *                 如果这个参数不是空值，则以异步的方式工作，此时函数会返回空值
        */
        public static Load(url: string, callback: (csv: dataframe) => void = null): dataframe {
            if (callback == null || callback == undefined) {
                // 同步
            } else {
                // 异步
                return null;
            }
        }
    }
}