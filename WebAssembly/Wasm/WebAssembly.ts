namespace TypeScript {

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

        function buildFunc(func: object): object {
            return function () {
                let params: any[] = [];
                let value: any;

                for (var i = 0; i < arguments.length; i++) {
                    value = arguments[i];

                    if (!value || typeof value == "undefined") {
                        // zero intptr means nothing or value 0
                        value = 0;
                    } else if (typeof value == "string" || typeof value == "object") {
                        value = WebAssembly.ObjectManager.addObject(value);
                    } else if (typeof value == "boolean") {
                        value = value ? 1 : 0;
                    } else {
                        // do nothing
                    }

                    params.push(value);
                }

                return (<any>func).apply(this, Array.prototype.slice.call(params, 1));
            }
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
            dependencies["Math"] = (<any>window).Math;
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