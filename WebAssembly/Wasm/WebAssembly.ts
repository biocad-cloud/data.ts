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
                    if (typeof logging == "object" && logging.outputEverything) {
                        console.log("Load external WebAssembly module success!");
                        console.log(wasm);
                    }

                    run(wasm);
                });
        }
    }

    export class memoryReader {

        protected sizeOf: (obj: number) => number;
        protected buffer: ArrayBuffer;

        public constructor(wasm: IWasm) {
            this.sizeOf = wasm.instance.exports.MemorySizeOf;
            this.buffer = wasm.instance.exports.memory.buffer;
        }
    }

    export class stringReader extends memoryReader {

        private decoder: TextDecoder = new TextDecoder();

        /**
         * @param memory The memory buffer
        */
        public constructor(wasm: IWasm) {
            super(wasm);
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