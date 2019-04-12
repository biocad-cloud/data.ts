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
        export function RunAssembly(module: string, run: Delegate.Sub, imports: {} = null): void {
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

    export class stringReader {

        private decoder: TextDecoder = new TextDecoder();
        private buffer: ArrayBuffer;

        /**
         * @param memory The memory buffer
        */
        public constructor(memory: WasmMemory | IWasm | ArrayBuffer) {
            if (memory instanceof ArrayBuffer) {
                this.buffer = memory;
            } else if (Object.keys(memory).indexOf("memory") > -1) {
                this.buffer = (<WasmMemory>memory).buffer;
            } else {
                this.buffer = (<IWasm>memory).instance.exports.memory.buffer;
            }
        }

        /**
         * Read text from WebAssembly memory buffer.
        */
        public readText(offset: number, length: number): string {
            let str = new Uint8Array(this.buffer, offset, length);
            let text: string = this.decoder.decode(str);

            return text;
        }
    }

}