module TypeExtensions {

    export const objectIsNothing: string = "Object is nothing! [https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/nothing]";

    export function ensureNumeric(x: number | string): number {
        if (typeof x == "number") {
            return x;
        } else {
            return parseFloat(x);
        }
    }
}