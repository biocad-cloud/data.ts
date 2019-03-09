class Matrix<T> {

    private matrix: T[][];

    /**
     * [m, n], m列n行
    */
    public constructor(m: number, n: number) {
        this.matrix = [];

        for (var i: number = 0; i < n; i++) {
            this.matrix.push();
        }
    }


}