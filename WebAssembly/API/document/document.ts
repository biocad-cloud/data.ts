namespace WebAssembly {

    export class document {

        private streamReader: TypeScript.stringReader;

        public constructor(public wasm: TypeScript.IWasm) {
            this.streamReader = new TypeScript.stringReader(wasm);
        }

        public getElementById(id: number): HTMLElement {
            return window.document.getElementById(this.streamReader.readText(id));
        }
    }
}