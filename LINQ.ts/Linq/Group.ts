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

    /**
     * 创建一个键值对映射序列，这些映射都具有相同的键名
    */
    public ToMaps(): Map<TKey, T>[] {
        return From(this.sequence)
            .Select(x => new Map<TKey, T>(this.Key, x))
            .ToArray();
    }
}