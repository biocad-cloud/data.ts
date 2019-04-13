namespace WebAssembly {

    export class document {

        private streamReader: TypeScript.stringReader;
        private hashCode: number;
        private hashTable: object = {};

        public constructor(public wasm: TypeScript.IWasm = null) {
            if (wasm && typeof wasm != "undefined") {
                this.streamReader = new TypeScript.stringReader(wasm);
            }
        }

        public hook(assembly: TypeScript.IWasm): document {
            this.streamReader = new TypeScript.stringReader(assembly);
            return this;
        }

        public getElementById(id: number): number {
            let idText: string = this.streamReader.readText(id);
            let node = window.document.getElementById(idText);

            return this.addObject(node);
        }

        public writeElementText(key: number, text: number) {
            let node: HTMLElement = this.hashTable[key];
            let textVal: string = this.streamReader.readText(text);

            node.innerText = textVal;
        }

        private addObject(o: any): number {
            var key: number = this.hashCode;

            this.hashTable[this.hashCode] = o;
            this.hashCode++;

            return key;
        }
    }
}