namespace TypeScript {

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
        public constructor(wasm: IWasm, memory: WasmMemory = null) {
            super(wasm);

            if (memory) {
                this.buffer = memory.buffer;
            }
        }

        /**
         * Read text from WebAssembly memory buffer.
        */
        public readTextRaw(offset: number, length: number): string {
            let str = new Uint8Array(this.buffer, offset, length);
            let text: string = this.decoder.decode(str);

            return text;
        }

        public readText(intPtr: number): string {
            return this.readTextRaw(intPtr, this.sizeOf(intPtr));
        }
    }
}