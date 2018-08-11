interface IEnumerable<T> {

    readonly Count: number;
    readonly [index: number]: T;

    /**
     * This function should returns a clone copy of the source sequence.
    */
    ToArray(): T[];
}