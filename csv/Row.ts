namespace csv {

    /**
     * 一行数据
    */
    export class row extends IEnumerator<string> {

        /**
         * 当前的这一个行对象的列数据集合
        */
        public columns: string[];

        /**
         * 这个只读属性仅用于生成csv文件
        */
        public get rowLine(): string {
            return From(this.columns)
                .Select(row.autoEscape)
                .JoinBy(",");
        }

        public constructor(cells: string[]) {
            super(cells);
        }

        private static autoEscape(c: string): string {
            if (c.indexOf(",") > -1) {
                return `"${c}"`;
            } else {
                return c;
            }
        }

        public static Parse(line: string): row {

        }
    }
}