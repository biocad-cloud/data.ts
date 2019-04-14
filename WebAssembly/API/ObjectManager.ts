namespace WebAssembly {

    /**
     * Object manager for VB.NET webassembly application.
    */
    export module ObjectManager {

        let streamReader: TypeScript.stringReader;
        let hashCode: number = 0;
        let hashTable: object = {};

        /**
         * Load WebAssembly memory buffer into Javascript runtime.
        */
        export function load(bytes: TypeScript.WasmMemory): void {
            streamReader = new TypeScript.stringReader(bytes);
        }

        /**
         * Read text data from WebAssembly runtime its memory block
         * 
         * @param intptr The memory pointer
        */
        export function readText(intptr: number): string {
            return streamReader.readText(intptr);
        }

        /**
         * Get a object using its hash code
         * 
         * @returns If object not found, null will be returns
        */
        export function getObject(key: number): any {
            if (key in hashTable) {
                return hashTable[key];
            } else {
                return null;
            }
        }

        /**
         * Add any object to a internal hashTable and then returns its hash code.
        */
        export function addObject(o: any): number {
            var key: number = hashCode;

            hashTable[hashCode] = o;
            hashCode++;

            return key;
        }
    }
}