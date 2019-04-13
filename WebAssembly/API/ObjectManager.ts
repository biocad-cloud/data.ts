namespace WebAssembly {

    export module ObjectManager {

        let streamReader: TypeScript.stringReader;
        let hashCode: number = 0;
        let hashTable: object = {};

        export function load(bytes: TypeScript.WasmMemory): void {
            streamReader = new TypeScript.stringReader(bytes);
        }

        export function readText(intptr: number): string {
            return streamReader.readText(intptr);
        }

        export function getObject(key: number): any {
            return hashTable[key];
        }

        export function addObject(o: any): number {
            var key: number = hashCode;

            hashTable[hashCode] = o;
            hashCode++;

            return key;
        }
    }
}