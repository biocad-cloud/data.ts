namespace Internal {

    export function Static<T>(): TypeScript {
        var ins: any = function (any: ((() => void) | T | T[]), args: object) {
            var type: TypeInfo = TypeInfo.typeof(any);
            var typeOf: string = type.typeOf;
            var handle = Linq.TsQuery.handler;
            var eval: any = typeOf in handle ? handle[typeOf]() : null;

            if (type.IsArray) {
                // 转化为序列集合对象，相当于from函数
                var creator = <Linq.TsQuery.arrayEval<T>>eval;
                return <IEnumerator<T>>creator.doEval(<T[]>any, type, args);
            } else if (type.typeOf == "function") {
                // 当html文档加载完毕之后就会执行传递进来的这个
                // 函数进行初始化
                DOM.ready(<() => void>any);
            } else if (!isNullOrUndefined(eval)) {
                // 对html文档之中的节点元素进行查询操作
                // 或者创建新的节点
                return (<Linq.TsQuery.IEval<T>>eval).doEval(<T>any, type, args);
            } else {
                eval = handle[type.class];

                if (!isNullOrUndefined(eval)) {
                    return (<Linq.TsQuery.IEval<T>>eval()).doEval(<T>any, type, args);
                } else {
                    throw `Unsupported data type: ${type.toString()}`;
                }
            }
        };

        return <TypeScript>ins;
    }
}