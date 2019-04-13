namespace WebAssembly {

    export module Document {

        let streamReader: TypeScript.stringReader;
        let hashCode: number;
        let hashTable: object = {};

        export function load(bytes: TypeScript.WasmMemory): void {
            streamReader = new TypeScript.stringReader(bytes);
        }

        export function getElementById(id: number): number {
            let idText: string = streamReader.readText(id);
            let node = window.document.getElementById(idText);

            return addObject(node);
        }

        export function writeElementText(key: number, text: number) {
            let node: HTMLElement = hashTable[key];
            let textVal: string = streamReader.readText(text);

            node.innerText = textVal;
        }

        function addObject(o: any): number {
            var key: number = hashCode;

            hashTable[hashCode] = o;
            hashCode++;

            return key;
        }
    }
}