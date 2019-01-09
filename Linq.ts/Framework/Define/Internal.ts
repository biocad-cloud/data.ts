/// <reference path="TS.ts" />
/// <reference path="../../Data/StringHelpers/URL.ts" />
/// <reference path="../../Data/StringHelpers/PathHelper.ts" />
/// <reference path="../Modes.ts" />

/**
 * The internal implementation of the ``$ts`` object.
*/
namespace Internal {

    export const StringEval = new Handlers.stringEval();

    const warningLevel: number = Modes.development;
    const anyoutputLevel: number = Modes.debug;
    const errorOnly: number = Modes.production;

    /**
     * 应用程序的开发模式：只会输出框架的警告信息
    */
    export function outputWarning(): boolean {
        return $ts.mode <= warningLevel;
    }

    /**
     * 框架开发调试模式：会输出所有的调试信息到终端之上
    */
    export function outputEverything(): boolean {
        return $ts.mode == anyoutputLevel;
    }

    /**
     * 生产模式：只会输出错误信息
    */
    export function outputError(): boolean {
        return $ts.mode == errorOnly;
    }

    /**
     * 对``$ts``对象的内部实现过程在这里
    */
    export function Static<T>(): TypeScript {
        var handle = Internal.Handlers.Shared;
        var ins: any = (any: ((() => void) | T | T[]), args: object) => queryFunction(handle, any, args);

        const stringEval = handle.string();

        ins.mode = Modes.production;

        ins = extendsUtils(ins, stringEval);
        ins = extendsLINQ(ins);
        ins = extendsHttpHelpers(ins);
        ins = extendsSelector(ins);

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
        ts.upload = function (url: string, file: File, callback?: ((response: IMsg<{}>) => void)) {
            HttpHelpers.UploadFile(url, file, null, function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };

        ts.windowLocation = TsLinq.URL.WindowLocation;
        ts.parseURL = (url => new TsLinq.URL(url));
        ts.goto = Goto;

        return ts;
    }

    function handleJSON(response: any): any {
        if (typeof response == "string") {

            /*
            if (TsLinq.URL.IsWellFormedUriString(response)) {
                // 是一个uri字符串，则不做解析
                return response;
            }*/

            // 尝试以json的格式进行结果的解析
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

    function extendsUtils(ts: any, stringEval: Handlers.stringEval): any {
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
            var nodeID: string = Handlers.EnsureNodeId(id);
            var node: IHTMLElement = stringEval.doEval(nodeID, null, null);

            return (<HTMLElement>node).innerText;
        };
        ts.loadJSON = function (id: string) {
            return JSON.parse(this.loadText(id));
        };

        // file path helpers
        ts.parseFileName = TsLinq.PathHelper.fileName;

        /**
         * 得到不带有拓展名的文件名部分的字符串
         * 
         * @param path Full name
        */
        ts.baseName = TsLinq.PathHelper.basename;
        /**
         * 得到不带小数点的文件拓展名字符串
         * 
         * @param path Full name
        */
        ts.extensionName = TsLinq.PathHelper.extensionName;
        ts.withExtensionName = function (path: string, ext: string) {
            var fileExt: string = $ts.extensionName(path);
            var equals: boolean = fileExt.toLowerCase() == ext.toLowerCase();

            return equals;
        };

        return ts;
    }

    function extendsLINQ(ts: any): any {
        ts.isNullOrEmpty = function (obj: any) {
            return IsNullOrEmpty(obj);
        }
        ts.from = From;
        ts.csv = {
            toObjects: (data: string) => csv.dataframe.Parse(data).Objects(),
            toText: data => csv.toDataFrame(data).buildDoc()
        };

        return ts;
    }

    function extendsSelector(ts: any): any {
        ts.select = function (query: string, context: Window = window) {
            return Handlers.stringEval.select(query, context);
        }
        ts.select.getSelectedOptions = function (query: string, context: Window = window) {
            var sel: HTMLElement = $ts(query, {
                context: context
            });
            var options = DOM.getSelectedOptions(<any>sel);

            return new DOMEnumerator<HTMLOptionElement>(options);
        };
        ts.select.getOption = function (query: string, context: Window = window) {
            var sel: HTMLElement = $ts(query, {
                context: context
            });
            var options = DOM.getSelectedOptions(<any>sel);

            if (options.length == 0) {
                return null;
            } else {
                return options[0].value;
            }
        };

        return ts;
    }

    export function queryFunction<T>(handle: object, any: ((() => void) | T | T[]), args: object): any {
        var type: TypeInfo = TypeInfo.typeof(any);
        var typeOf: string = type.typeOf;
        var eval: any = typeOf in handle ? handle[typeOf]() : null;

        if (type.IsArray) {
            // 转化为序列集合对象，相当于from函数                
            return (<Handlers.arrayEval<T>>eval).doEval(<T[]>any, type, args);
        } else if (type.typeOf == "function") {
            // 当html文档加载完毕之后就会执行传递进来的这个
            // 函数进行初始化
            DOM.ready(<() => void>any);
        } else if (!isNullOrUndefined(eval)) {
            // 对html文档之中的节点元素进行查询操作
            // 或者创建新的节点
            return (<Handlers.IEval<T>>eval).doEval(<T>any, type, args);
        } else {
            eval = handle[type.class];

            if (!isNullOrUndefined(eval)) {
                return (<Handlers.IEval<T>>eval()).doEval(<T>any, type, args);
            } else {
                throw `Unsupported data type: ${type.toString()}`;
            }
        }
    }
}