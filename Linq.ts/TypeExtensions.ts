/// <reference path="./Collections/Map.ts" />

module TypeExtensions {

    export const objectIsNothing: string = "Object is nothing! [https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/nothing]";
    export const DictionaryMap: string = TypeInfo.typeof(new MapTuple("","")).class

    export function ensureNumeric(x: number | string): number {
        if (typeof x == "number") {
            return x;
        } else {
            return parseFloat(x);
        }
    }
}