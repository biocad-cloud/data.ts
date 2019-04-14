namespace WebAssembly {

    export module RegularExpression {

        export function regexp(pattern: number, flags: number): number {
            let patternText: string = ObjectManager.readText(pattern)
            let r = new RegExp(patternText, ObjectManager.readText(flags))

            return ObjectManager.addObject(r);
        }

        export function replace(text: number, pattern: number, replacement: number): number {
            let input: string = ObjectManager.readText(text)
            let patternObj: RegExp = ObjectManager.getObject(pattern)
            let replaceAs: string = ObjectManager.readText(replacement);
            let result: string = input.replace(patternObj, replaceAs);

            return ObjectManager.addObject(result);
        }
    }
}