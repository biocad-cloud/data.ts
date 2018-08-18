namespace csv {

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
    }
}