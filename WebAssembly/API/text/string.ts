namespace WebAssembly {

    /**
     * String api from javascript.
    */
    export module JsString {

        export function fromCharCode(n: number): number {
            let s: string = String.fromCharCode(n);
            return ObjectManager.addObject(s);
        }

        export function toString(obj: object): number {
            let s: string = obj.toString();
            return ObjectManager.addObject(s);
        }

        export function add(a: number, b: number): number {
            let str1: string = ObjectManager.readText(a);
            let str2: string = ObjectManager.readText(b);

            return ObjectManager.addObject(str1 + str2);
        }
    }
}