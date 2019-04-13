namespace TypeScript {

    export interface WebAssembly {

        instantiate(module: Uint8Array, dependencies: object): IWasm;
    }

    export interface IWasm {
        instance: WasmInstance;
    }

    export interface WasmInstance {
        exports: {
            
        }
    }

    export interface WasmMemory {
        buffer: ArrayBuffer
    }
}