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

        /**
         * Returns a Boolean value that indicates whether or not a pattern exists in a 
         * searched string.
         * 
         * @param string String on which to perform the search.
        */
        export function test(pattern: number, string: number): number {
            let patternObj: RegExp = ObjectManager.getObject(pattern);
            let text: string = ObjectManager.readText(string);

            return patternObj.test(text) ? 1 : 0;
        }

        /**
         * Executes a search on a string using a regular expression pattern, and returns an array 
         * containing the results of that search.
         * 
         * @param string The String object or string literal on which to perform the search.
        */
        export function exec(pattern: number, string: number): number {
            let patternObj: RegExp = ObjectManager.getObject(pattern);
            let text: string = ObjectManager.readText(string);
            let match = patternObj.exec(text);

            return ObjectManager.addObject(match);
        }
    }
}