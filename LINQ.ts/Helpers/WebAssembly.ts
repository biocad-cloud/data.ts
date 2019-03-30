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
        export function RunAssembly(module: string, run: Delegate.Sub): void {
            fetch(module).then(function (response) {
                return response.arrayBuffer();
            })
                .then(function (buffer) {
                    var dependencies = {
                        "global": {},
                        "env": {}
                    };
                    var moduleBufferView = new Uint8Array(buffer);
                    var engine = (<any>window).WebAssembly;

                    dependencies["Math"] = (<any>window).Math;

                    return engine.instantiate(moduleBufferView, dependencies);
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