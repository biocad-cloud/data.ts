namespace WebAssembly {

    /**
     * String api from javascript.
    */
    export module JsString {

        export function fromCharCode(n: number): number {
            let s: string = String.fromCharCode(n);
            return ObjectManager.addText(s);
        }

        export function charCodeAt(text: number, index: number): number {
            let input: string = ObjectManager.readText(text);
            return input.charCodeAt(index);
        }

        export function charAt(text: number, index: number): number {
            let input: string = ObjectManager.readText(text);
            return ObjectManager.addText(input.charAt(index));
        }

        export function join(text: number, deli: number): number {
            let inptrs: number[] = ObjectManager.getObject(text);
            let strs: string[] = inptrs.map(i => ObjectManager.readText(i));
            let deliText: string = ObjectManager.readText(deli);
            let output: string = strs.join(deliText);

            return ObjectManager.addText(output);
        }

        export function toString(obj: number): number {
            let s: string;

            if (ObjectManager.isNull(obj)) {
                // 没有目标，说明是一个数字
                s = obj.toString();
            } else {
                // 不是空的，说明是一个对象
                s = ObjectManager.getObject(obj).toString();
            }

            return ObjectManager.addText(s);
        }

        export function add(a: number, b: number): number {
            let str1: string = ObjectManager.readText(a);
            let str2: string = ObjectManager.readText(b);

            return ObjectManager.addText(str1 + str2);
        }

        export function length(text: number): number {
            return ObjectManager.readText(text).length;
        }

        export function replace(text: number, find: number, replacement: number): number {
            let input: string = ObjectManager.readText(text);
            let findObj: RegExp | string;

            if (ObjectManager.getType(find) == "RegExp") {
                findObj = ObjectManager.getObject(find);
            } else {
                findObj = ObjectManager.readText(find);
            }

            let replaceStr: string = ObjectManager.readText(replacement);
            let result: string = input.replace(findObj, replaceStr);

            return ObjectManager.addText(result);
        }

        export function indexOf(input: number, find: number): number {
            let text: string = ObjectManager.readText(input);
            let findText: string = ObjectManager.readText(find);

            return text.indexOf(findText);
        }
    }
}