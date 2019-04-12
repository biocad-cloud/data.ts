namespace TypeScript {

    /**
     * The web assembly helper
    */
    export module Wasm {

        /** 
         * Run the compiled VisualBasic.NET assembly module
         * 
         * > This function add javascript ``math`` module as imports object automatic
         * 
         * @param module The ``*.wasm`` module file path
         * @param run A action delegate for utilize the VB.NET assembly module
         *         
        */
        export function RunAssembly(module: string, run: Delegate.Sub, imports: {} = null): void {
            var engine = (<any>window).WebAssembly;
            var dependencies = {
                "global": {},
                "env": {}
            };

            dependencies["Math"] = (<any>window).Math;

            if (typeof imports == "object") {
                for (var key in imports) {
                    dependencies[key] = imports[key];
                }
            }

            fetch(module)
                .then(function (response) {
                    if (response.ok) {
                        return response.arrayBuffer();
                    } else {
                        throw `Unable to fetch Web Assembly file ${module}.`;
                    }
                })
                .then(buffer => new Uint8Array(buffer))
                .then(function (module) {
                    return engine.instantiate(module, dependencies);
                }).then(wasm => {
                    if (logging.outputEverything) {
                        console.log("Load external WebAssembly module success!");
                        console.log(wasm);
                    }

                    run(wasm);
                });
        }
    }
}