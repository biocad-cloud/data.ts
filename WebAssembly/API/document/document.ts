namespace WebAssembly {

    export class Document {

        private streamReader: TypeScript.stringReader;
        private hashCode: number;
        private hashTable: object = {};

        public constructor(bytes: TypeScript.WasmMemory) {
            this.streamReader = new TypeScript.stringReader(bytes);
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