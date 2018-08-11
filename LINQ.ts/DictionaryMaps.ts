/**
 * 描述了一个键值对集合
*/
class Map<K, V> {

    public Key: K;
    public value: V;

    public constructor(key: K = null, value: V = null) {
        this.Key = key;
        this.value = value;
    }

    public toString(): string {
        return `[${this.Key.toString()}, ${this.value.toString()}]`;
    }
}

class Dictionary<V> extends IEnumerator<Map<string, V>>  {

    private maps: object;

    public constructor(maps: object) {
        super(Dictionary.ObjectMaps<V>(maps));
        this.maps = maps;
    }

    public static ObjectMaps<V>(maps: object): Map<string, V>[] {
        return From(Object.keys(maps))
            .Select(key => new Map<string, V>(key, maps[key]))
            .ToArray()
    }
}