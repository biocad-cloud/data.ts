namespace TypeScript {

    export interface WebAssembly {

        instantiate(module: Uint8Array, dependencies: object): IWasm;
    }

    export interface IWasm {
        instance: WasmInstance;
    }

    export interface WasmInstance {
        exports: {
            memory: WasmMemory,
            /**
             * Get object bytes in memory
            */
            MemorySizeOf: (ptr: number) => number;
        }
    }

    export interface WasmMemory {
        buffer: ArrayBuffer
    }
}