namespace csv {

    export class row {

        public columns: string[];

        /**
         * 这个只读属性仅用于生成csv文件
        */
        public get rowLine(): string {
            return From(this.columns)
                .Select(row.autoEscape)
                .JoinBy(",");
        }

        private static autoEscape(c: string): string {
            if (c.indexOf(",") > -1) {
                return `"${c}"`;
            } else {
                return c;
            }
        }
    }
}