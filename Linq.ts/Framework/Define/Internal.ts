/// <reference path="TS.ts" />

/**
 * The internal implementation of the ``$ts`` object.
*/
namespace Internal {

    /**
     * 对``$ts``对象的内部实现过程在这里
    */
    export function Static<T>(): TypeScript {
        var handle = Linq.TsQuery.handler;
        var ins: any = (any: ((() => void) | T | T[]), args: object) => queryFunction(handle, any, args);

        const stringEval = handle.string();

        ins.FrameworkDebug = false;

        ins = extendsUtils(ins, stringEval);
        ins = extendsLINQ(ins);
        ins = extendsHttpHelpers(ins);

        return <TypeScript>ins;
    }

    function extendsHttpHelpers(ts: any): any {
        ts.post = function (url: string, data: object | FormData,
            callback?: ((response: IMsg<{}>) => void),
            options?: {
                sendContentType?: boolean
            }) {

            var contentType: string = HttpHelpers.measureContentType(data);
            var post = <HttpHelpers.PostData>{
                type: contentType,
                data: data,
                sendContentType: (options || {}).sendContentType || true
            };

            HttpHelpers.POST(url, post, function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };
        ts.get = function (url: string, callback?: ((response: IMsg<{}>) => void)) {
            HttpHelpers.GetAsyn(url, function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };

        return ts;
    }

    function handleJSON(response: any): any {
        if (typeof response == "string") {
            try {
                return JSON.parse(response);
            } catch (ex) {
                console.error("Invalid json text: ");
                console.error(response);

                throw ex;
            }
        } else {
            return response;
        }
    }

    function extendsUtils(ts: any, stringEval: Linq.TsQuery.stringEval): any {
        ts.imports = function (
            jsURL: string | string[],
            callback: () => void = DoNothing,
            onErrorResumeNext: boolean = false,
            echo: boolean = false) {

            return new HttpHelpers.Imports(jsURL, onErrorResumeNext, echo).doLoad(callback);
        };
        ts.eval = function (script: string, lzw: boolean = false, callback?: () => void) {
            if (lzw) {
                script = LZW.decode(script);
            }
            HttpHelpers.Imports.doEval(script, callback);
        }
        ts.loadText = function (id: string) {
            var nodeID: string = Linq.TsQuery.EnsureNodeId(id);
            var node: IHTMLElement = stringEval.doEval(nodeID, null, null);

            return (<HTMLElement>node).innerText;
        };
        ts.loadJSON = function (id: string) {
            return JSON.parse(this.loadText(id));
        };

        return ts;
    }

    function extendsLINQ(ts: any): any {
        ts.isNullOrEmpty = function (obj: any) {
            return IsNullOrEmpty(obj);
        }
        ts.From = From;
        ts.csv = {
            toObjects: (data: string) => csv.dataframe.Parse(data).Objects(),
            toText: data => csv.toDataFrame(data).buildDoc()
        };

        return ts;
    }

    function queryFunction<T>(handle: object, any: ((() => void) | T | T[]), args: object): any {
        var type: TypeInfo = TypeInfo.typeof(any);
        var typeOf: string = type.typeOf;
        var eval: any = typeOf in handle ? handle[typeOf]() : null;

        if (type.IsArray) {
            // 转化为序列集合对象，相当于from函数                
            return (<Linq.TsQuery.arrayEval<T>>eval).doEval(<T[]>any, type, args);
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
    }
}