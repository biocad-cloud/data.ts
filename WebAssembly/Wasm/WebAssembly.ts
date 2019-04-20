namespace TypeScript {

    export interface IWasmFunc {
        (): void;

        /**
         * 当前的这个函数在WebAssembly导出来的函数的申明原型
        */
        WasmPrototype: () => any;
    }

    /**
     * The web assembly helper
    */
    export module Wasm {

        /**
         * The webassembly engine.
        */
        const engine: WebAssembly = (<any>window).WebAssembly;

        /** 
         * Run the compiled VisualBasic.NET assembly module
         * 
         * > This function add javascript ``math`` module as imports object automatic
         * 
         * @param module The ``*.wasm`` module file path
         * @param run A action delegate for utilize the VB.NET assembly module
         *         
        */
        export function RunAssembly(module: string, opts: Config): void {
            fetch(module)
                .then(function (response) {
                    if (response.ok) {
                        return response.arrayBuffer();
                    } else {
                        throw `Unable to fetch Web Assembly file ${module}.`;
                    }
                })
                .then(buffer => new Uint8Array(buffer))
                .then(module => ExecuteInternal(module, opts))
                .then(assembly => {
                    if (typeof logging == "object" && logging.outputEverything) {
                        console.log("Load external WebAssembly module success!");
                        console.log(assembly);
                    }

                    opts.run(exportWasmApi(assembly));
                });
        }

        function exportWasmApi(assm: IWasm): object {
            let exports = assm.instance.exports;
            let api: object = {};

            for (let name in exports) {
                let obj = exports[name];

                if (typeof obj == "function") {
                    obj = buildFunc(obj);
                } else {
                    // do nothing
                }

                api[name] = obj;
            }

            return api;
        }

        /**
         * 主要是创建一个对参数的封装函数，因为WebAssembly之中只有4中基础的数值类型
         * 所以字符串，对象之类的都需要在这里进行封装之后才能够被传递进入WebAssembly
         * 运行时环境之中
        */
        function buildFunc(func: object): IWasmFunc {
            let ObjMgr = WebAssembly.ObjectManager;
            let api: IWasmFunc = <any>function () {
                let intptr: number = (<any>func).apply(this, buildArguments(<any>arguments));
                let result

                if (ObjMgr.isText(intptr)) {
                    result = ObjMgr.readText(intptr);
                } else if (!ObjMgr.isNull(intptr)) {
                    result = ObjMgr.getObject(intptr);
                } else {
                    result = intptr;
                }

                return result;
            }

            api.WasmPrototype = <any>func;

            return api;
        }

        function buildArguments(args: any[]): any[] {
            let params: any[] = [];
            let value: any;

            for (var i = 0; i < args.length; i++) {
                value = args[i];

                if (!value || typeof value == "undefined") {
                    // zero intptr means nothing or value 0
                    value = 0;
                } else if (typeof value == "string") {
                    value = WebAssembly.ObjectManager.addText(value);
                } else if (typeof value == "object") {
                    value = WebAssembly.ObjectManager.addObject(value);
                } else if (typeof value == "boolean") {
                    value = value ? 1 : 0;
                } else {
                    // do nothing
                }

                params.push(value);
            }

            return params;
        }

        function createBytes(opts: Config): TypeScript.WasmMemory {
            let page = opts.page || { init: 10, max: 2048 };
            let config = { initial: page.init };

            return new (<any>window).WebAssembly.Memory(config);
        }

        function ExecuteInternal(module: Uint8Array, opts: Config): IWasm {
            var byteBuffer: TypeScript.WasmMemory = createBytes(opts);
            var dependencies = {
                "global": {},
                "env": {
                    bytechunks: byteBuffer
                }
            };

            // read/write webassembly memory
            WebAssembly.ObjectManager.load(byteBuffer);
            // add javascript api dependencies imports
            handleApiDependencies(dependencies, opts);

            let assembly = engine.instantiate(module, dependencies);
            return assembly;
        }

        function getMath(): any {
            let runtime = (<any>window);
            let math = runtime.Math;

            math["isNaN"] = x => runtime.isNaN(x);
            math["isFinite"] = x => runtime.isFinite(x);

            return math;
        }

        function handleApiDependencies(dependencies: object, opts: Config) {
            var api: apiOptions = opts.api || {
                document: false,
                console: true,
                http: false,
                text: true,
                array: true
            };

            // imports the javascript math module for VisualBasic.NET 
            // module by default
            dependencies["Math"] = getMath();
            // Andalso imports some basically string api for VisualBasic.NET
            // as well
            dependencies["string"] = WebAssembly.JsString;

            if (typeof opts.imports == "object") {
                for (var key in opts.imports) {
                    dependencies[key] = opts.imports[key];
                }
            }

            if (api.document) {
                dependencies["document"] = WebAssembly.Document;
            }
            if (api.console) {
                dependencies["console"] = WebAssembly.Console;
            }
            if (api.http) {
                dependencies["XMLHttpRequest"] = WebAssembly.XMLHttpRequest;
            }
            if (api.text) {
                dependencies["RegExp"] = WebAssembly.RegularExpression;
                dependencies["Strings"] = WebAssembly.Strings;
            }
            if (api.array) {
                dependencies["Array"] = WebAssembly.JsArray;
            }

            return dependencies;
        }
    }
}