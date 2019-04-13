namespace WebAssembly {

    export class document {

        private streamReader: TypeScript.stringReader;
        private hashCode: number;
        private hashTable: object = {};
        private vm: document;

        public constructor(public wasm: TypeScript.IWasm = null) {
            if (wasm && typeof wasm != "undefined") {
                this.streamReader = new TypeScript.stringReader(wasm);
            }

            this.vm = this;
        }

        public hook(assembly: TypeScript.IWasm): document {
            this.vm.streamReader = new TypeScript.stringReader(assembly);
            this.vm.wasm = assembly;
            return this.vm;
        }

        public getElementById(id: number): number {
            let idText: string = this.vm.streamReader.readText(id);
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