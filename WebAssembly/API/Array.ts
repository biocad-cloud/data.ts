namespace WebAssembly {

    /**
     * 在这个模块之中，所有的obj都是指针类型
    */
    export module JsArray {

        export function push(array: number, obj: number): number {
            let a: number[] = ObjectManager.getObject(array);
            a.push(obj);
            return a.length;
        }

        export function pop(array: number): number {
            let a: number[] = ObjectManager.getObject(array);
            return a.pop();
        }

        export function indexOf(array: number, obj: number): number {
            let a: number[] = ObjectManager.getObject(array);
            return a.indexOf(obj);
        }
    }
}