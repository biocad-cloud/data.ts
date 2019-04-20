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

        export function create(): number {
            return ObjectManager.addObject([]);
        }

        export function get(array: number, index: number): number {
            let a: number[] = ObjectManager.getObject(array);
            let obj: number = a[index];

            return obj;
        }

        export function set(array: number, index: number, value: number): number {
            let a: number[] = ObjectManager.getObject(array);
            a[index] = value;
            return array;
        }

        export function length(array: number): number {
            let a: number[] = ObjectManager.getObject(array);
            return a.length;
        }
    }

    export class WasmArray {

        public items: any[];
        private intptrs: number[];

        public get length(): number {
            return this.items.length;
        }

        /**
         * @param type 0 for number, 1 for string, 2 for others
        */
        public constructor(public type: number) {
            this.items = [];
            this.intptrs = [];
        }

        public set(index: number, element: number) {
            let obj = ObjectManager.getObject(element);
            this.items[index] = obj;
            this.intptrs[index] = element;
        }

        public get(index: number): number {
            return this.intptrs[index];
        }
    }
}