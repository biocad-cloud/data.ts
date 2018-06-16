interface IEnumerable<T> {

    readonly Count: number;
    readonly [index: number]: T;

    /**
     * This function should returns a clone copy of the source sequence.
    */
    ToArray(): T[];
}

class Group<TKey, T> extends IEnumerator<T> {

    public Key: TKey;

    /**
     * Group members, readonly property.
    */
    public get Group(): T[] {
        return this.sequence;
    }

    constructor(key: TKey, group: T[]) {
        super(group);
        this.Key = key;
    }
}