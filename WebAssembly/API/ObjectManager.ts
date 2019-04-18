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
            if ((intptr in hashTable) && typeof hashTable[intptr] == "string") {
                return hashTable[intptr];
            } else {
                return streamReader.readText(intptr);
            }
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

        export function isNull(intPtr: number): boolean {
            return !(intPtr in hashTable);
        }

        export function getType(hashCode: number): string {
            if (hashCode in hashTable) {
                let type: string;
                let obj: any = hashTable[hashCode];

                if (Array.isArray(obj)) {
                    return "array"
                }

                if ((type = typeof obj) == "object") {
                    return obj.constructor.name;
                } else {
                    return type;
                }
            } else {
                return "void";
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