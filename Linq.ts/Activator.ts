module Activator {

    export function CreateInstance(): any {

    }

    /**
    * 利用一个名称字符串集合创建一个js对象
    * 
    * @param names object的属性名称列表
    * @param init 使用这个函数为该属性指定一个初始值
   */
    export function EmptyObject<V>(names: string[] | IEnumerator<string>, init: () => V): object {
        var obj: object = {};

        if (typeof init == "function") {
            // 通过函数来进行初始化，则每一个属性值可能会不一样
            // 例如使用随机数函数来初始化
            let create: Delegate.Func<V> = <any>init;

            if (Array.isArray(names)) {
                names.forEach(name => obj[name] = create());
            } else {
                names.ForEach(name => obj[name] = create());
            }
        } else {
            // 直接是一个值的时候，则所有的属性值都是一样的          
            if (Array.isArray(names)) {
                names.forEach(name => obj[name] = <V>init);
            } else {
                names.ForEach(name => obj[name] = <V>init);
            }
        }

        return obj;
    }

    /**
     * 从键值对集合创建object对象，键名或者名称属性会作为object对象的属性名称
    */
    export function CreateObject<V>(nameValues: NamedValue<V>[] |
        IEnumerator<NamedValue<V>> |
        MapTuple<string, V>[] |
        IEnumerator<MapTuple<string, V>>): object {

        let obj: object = {};
        let type = TypeInfo.typeof(nameValues);

        if (type.IsArray && type.class == "MapTuple") {
            (<MapTuple<string, V>[]>nameValues).forEach(map => obj[map.key] = map.value);
        } else if (type.IsArray && type.class == "NamedValue") {
            (<NamedValue<V>[]>nameValues).forEach(nv => obj[nv.name] = nv.value);
        } else if (type.class == "IEnumerator") {
            var seq = <IEnumerator<any>>nameValues;

            type = seq.ElementType;

            if (type.class == "MapTuple") {
                (<IEnumerator<MapTuple<string, V>>>nameValues)
                    .ForEach(map => {
                        obj[map.key] = map.value;
                    });
            } else if (type.class == "NamedValue") {
                (<IEnumerator<NamedValue<V>>>nameValues)
                    .ForEach(nv => {
                        obj[nv.name] = nv.value;
                    });
            } else {
                console.error(type);
                throw `Unsupport data type: ${type.class}`;
            }

        } else {
            throw `Unsupport data type: ${JSON.stringify(type)}`;
        }

        return obj;
    }
}