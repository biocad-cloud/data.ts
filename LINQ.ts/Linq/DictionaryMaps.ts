/**
 * 描述了一个键值对集合
*/
class Map<K, V> {

    /**
     * 键名称，一般是字符串
    */
    public key: K;
    /**
     * 目标键名所映射的值
    */
    public value: V;

    /**
     * 创建一个新的键值对集合
     * 
    */
    public constructor(key: K = null, value: V = null) {
        this.key = key;
        this.value = value;
    }

    public toString(): string {
        return `[${this.key.toString()}, ${this.value.toString()}]`;
    }
}

/**
 * 键值对映射哈希表
*/
class Dictionary<V> extends IEnumerator<Map<string, V>>  {

    private maps: object;

    public Item(key: string): V {
        return <V>(this.maps[key]);
    }

    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    public constructor(maps: object) {
        super(Dictionary.ObjectMaps<V>(maps));
        this.maps = maps;
    }

    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    public static ObjectMaps<V>(maps: object): Map<string, V>[] {
        return From(Object.keys(maps))
            .Select(key => new Map<string, V>(key, maps[key]))
            .ToArray()
    }
}