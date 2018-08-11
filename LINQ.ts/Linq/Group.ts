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