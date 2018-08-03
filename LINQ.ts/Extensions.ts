/// <reference path="Linq/Enumerator.ts" />

/**
 * Linq数据流程管线的起始函数
 * 
 * @param source 需要进行数据加工的集合对象
*/
function From<T>(source: T[]): IEnumerator<T> {
    return new IEnumerator<T>(source);
}

/**
 * 判断目标对象集合是否是空的？
*/
function IsNullOrEmpty<T>(array: T[]): boolean {
    if (array == null || array == undefined) {
        return true;
    } else if (array.length == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 通用数据拓展函数集合
*/
module DataExtensions {

    /**
     * 尝试将任意类型的目标对象转换为数值类型
    */
    export function as_numeric(obj: any): number {
        if (typeof obj === 'number') {
            return <number>obj;
        } else if (typeof obj === 'boolean') {
            if (obj == true) {
                return 1;
            } else {
                return -1;
            }
        } else if (typeof obj == 'undefined') {
            return 0;
        } else if (typeof obj == 'string') {
            return parseFloat(<string>obj);
        } else {
            return 0;
        }
    }
}