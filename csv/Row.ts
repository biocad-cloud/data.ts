namespace csv {

    /**
     * 一行数据
    */
    export class row extends IEnumerator<string> {

        /**
         * 当前的这一个行对象的列数据集合
         * 
         * 注意，你无法通过直接修改这个数组之中的元素来达到修改这个行之中的值的目的
         * 因为这个属性会返回这个行的数组值的复制对象
        */
        public get columns(): string[] {
            return [...this.sequence];
        }

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

        public ProjectObject(headers: string[] | IEnumerator<string>): object {
            var obj: object = {};
            var data: string[] = this.columns;

            if (Array.isArray(headers)) {
                headers.forEach((h, i) => {
                    obj[h] = data[i];
                });
            } else {
                headers.ForEach((h, i) => {
                    obj[h] = data[i];
                });
            }

            return obj;
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