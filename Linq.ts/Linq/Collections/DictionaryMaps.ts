/// <reference path="../../Data/StackTrace/StackTrace.ts" />

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

class NamedValue<T> {

    public name: string;
    public value: T;

    public get TypeOfValue(): TypeInfo {
        return TypeInfo.typeof(this.value);
    }
    public get IsEmpty(): boolean {
        return Strings.Empty(this.name) && (!this.value || this.value == undefined);
    }

    public toString(): string {
        return this.name;
    }
}

/**
 * 键值对映射哈希表
*/
class Dictionary<V> extends IEnumerator<Map<string, V>>  {

    private maps: object;

    /**
     * 如果键名称是空值的话，那么这个函数会自动使用caller的函数名称作为键名进行值的获取
     * 
     * https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
    */
    public Item(key: string | number = null): V {
        if (!key) {
            key = TsLinq.StackTrace.GetCallerMember().memberName;
        }

        if (typeof key == "string") {
            return <V>(this.maps[key]);
        } else {
            return this.sequence[key].value;
        }
    }

    public get Keys(): IEnumerator<string> {
        return From(Object.keys(this.maps));
    }

    public get Values(): IEnumerator<V> {
        return this.Keys.Select<V>(key => this.Item(key));
    }

    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    public constructor(maps: object | Map<string, V>[] | IEnumerator<Map<string, V>>) {
        super(Dictionary.ObjectMaps<V>(maps));

        if (Array.isArray(maps)) {
            this.maps = TypeInfo.CreateObject(maps);
        } else if (TypeInfo.typeof(maps).class == "IEnumerator") {
            this.maps = TypeInfo.CreateObject(<IEnumerator<Map<string, V>>>maps);
        } else {
            this.maps = maps;
        }
    }

    public static FromMaps<V>(maps: Map<string, V>[] | IEnumerator<Map<string, V>>): Dictionary<V> {
        return new Dictionary<V>(maps);
    }

    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    public static ObjectMaps<V>(maps: object | Map<string, V>[] | IEnumerator<Map<string, V>>): Map<string, V>[] {
        var type = TypeInfo.typeof(maps);

        if (Array.isArray(maps)) {
            return maps;
        } else if (type.class == "IEnumerator") {
            return (<IEnumerator<Map<string, V>>>maps).ToArray();
        } else {
            return From(Object.keys(maps))
                .Select(key => new Map<string, V>(key, maps[key]))
                .ToArray();
        }
    }

    public ContainsKey(key: string): boolean {
        return key in this.maps;
    }

    public Add(key: string, value: V): Dictionary<V> {
        this.maps[key] = value;
        this.sequence = Dictionary.ObjectMaps<V>(this.maps);
        return this;
    }

    public Delete(key: string): Dictionary<V> {
        if (key in this.maps) {
            delete this.maps[key];
            this.sequence = Dictionary.ObjectMaps<V>(this.maps);
        }

        return this;
    }
}