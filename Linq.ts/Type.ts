/**
 * 类似于反射类型
*/
class TypeInfo {

    /**
     * 直接使用系统内置的``typeof``运算符得到的结果
    */
    public readonly typeOf: string;

    /**
     * 类型class的名称，例如TypeInfo, IEnumerator等。
     * 如果这个属性是空的，则说明是js之中的基础类型
    */
    public readonly class: string;
    public readonly namespace: string;

    /**
     * class之中的字段域列表
    */
    public readonly property: string[];
    /**
     * 函数方法名称列表
    */
    public readonly methods: string[];

    /**
     * 是否是js之中的基础类型？
    */
    public get IsPrimitive(): boolean {
        return !this.class;
    }

    /**
     * 获取某一个对象的类型信息
    */
    public static typeof<T>(obj: T): TypeInfo {
        var type = typeof obj;
        var isObject: boolean = type == "object";

        return <TypeInfo>{
            typeOf: typeof obj,
            class: isObject ? (<any>obj.constructor).name : "",
            property: isObject ? Object.keys(obj) : [],
            methods: TypeInfo.GetObjectMethods(obj)
        };
    }

    public static GetObjectMethods<T>(obj: T): string[] {
        var res: string[] = [];

        for (var m in obj) {
            if (typeof obj[m] == "function") {
                res.push(m)
            }
        }

        return res;
    }

    public toString() {
        if (this.typeOf == "object") {
            return `<${this.typeOf}> ${this.class}`;
        } else {
            return this.typeOf;
        }
    }

    public static EmptyObject<V>(names: string[] | IEnumerator<string>, init: () => V): object {
        var obj: object = {};

        if (Array.isArray(names)) {
            names.forEach(name => obj[name] = init());
        } else {
            names.ForEach(name => obj[name] = init());
        }

        return obj;
    }

    public static CreateObject<V>(nameValues: NamedValue<V>[] | IEnumerator<NamedValue<V>>): object {
        var obj: object = {};

        if (Array.isArray(nameValues)) {
            nameValues.forEach(nv => obj[nv.name] = nv.value);
        } else {
            nameValues.ForEach(nv => obj[nv.name] = nv.value);
        }

        return obj;
    }

    public static CreateMetaReader<V>(nameValues: NamedValue<V>[] | IEnumerator<NamedValue<V>>): TsLinq.MetaReader {
        return new TsLinq.MetaReader(TypeInfo.CreateObject(nameValues));
    }
}