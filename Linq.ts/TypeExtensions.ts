/// <reference path="./Collections/Map.ts" />

namespace TypeExtensions {

    /**
     * Warning message of Nothing
    */
    export const objectIsNothing: string = "Object is nothing! [https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/nothing]";

    /**
     * 字典类型的元素类型名称字符串
    */
    export const DictionaryMap: string = TypeInfo.getClass(new MapTuple("", ""));

    /**
     * Make sure target input is a number
    */
    export function ensureNumeric(x: number | string): number {
        if (typeof x == "number") {
            return x;
        } else {
            return parseFloat(x);
        }
    }

    /**
     * 判断目标是否为可以直接转换为字符串的数据类型
    */
    export function isPrimitive(any: any): boolean {
        let type = typeof any;

        return type == "string" ||
            type == "number" ||
            type == "boolean";
    }
}