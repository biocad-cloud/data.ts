class Matrix<T> {

    private matrix: T[][];

    public get rows(): number {
        return this.matrix.length;
    }

    public get columns(): number {
        return this.matrix[0].length;
    }

    /**
     * [m, n], m列n行
    */
    public constructor(m: number, n: number, fill: T = null) {
        this.matrix = [];

        for (var i: number = 0; i < n; i++) {
            this.matrix.push(DataExtensions.Dim(m, fill));
        }
    }

    public M(i: number, j: number, val: T = null): T {
        if (isNullOrUndefined(val)) {
            // get
            return this.matrix[i][j];
        } else {
            this.matrix[i][j] = val;
        }
    }

    public column(i: number, set: T[] | IEnumerator<T> = null): T[] {
        if (isNullOrUndefined(set)) {
            // get
            let col: T[] = [];

            for (var j: number = 0; j < this.rows; j++) {
                col.push(this.matrix[j][i]);
            }

            return col;
        } else {
            let col: T[];

            if (Array.isArray(set)) {
                col = set;
            } else {
                col = set.ToArray(false);
            }

            for (var j: number = 0; j < this.rows; j++) {
                this.matrix[j][i] = col[j];
            }

            return null;
        }
    }

    public row(i: number, set: T[] | IEnumerator<T> = null): T[] {
        if (isNullOrUndefined(set)) {
            // get
            return this.matrix[i];
        } else {
            if (Array.isArray(set)) {
                this.matrix[i] = set;
            } else {
                this.matrix[i] = set.ToArray(false);
            }
        }
    }

    public toString(): string {
        return `[${this.rows}, ${this.columns}]`;
    }
}