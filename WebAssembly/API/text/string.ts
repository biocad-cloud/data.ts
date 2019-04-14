namespace WebAssembly {

    /**
     * String api from javascript.
    */
    export module JsString {

        export function fromCharCode(n: number): number {
            let s: string = String.fromCharCode(n);
            return ObjectManager.addObject(s);
        }
    }
}