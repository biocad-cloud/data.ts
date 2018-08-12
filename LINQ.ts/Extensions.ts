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
 * 
 * @param array 如果这个数组对象是空值或者未定义，都会被判定为空，如果长度为零，则同样也会被判定为空值
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
 * HTML/Javascript: how to access JSON data loaded in a script tag.
*/
function LoadJson(id: string): any {
    return JSON.parse(document.getElementById(id).textContent);
}

/**
 * 通用数据拓展函数集合
*/
module DataExtensions {

    /**
     * 尝试将任意类型的目标对象转换为数值类型
    */
    export function as_numeric(obj: any): number {
        if (obj == null || obj == undefined) {
            return 0;
        }

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
            if (<string>obj == '') {
                // 将空字符串转换为零
                return 0;
            } else {
                return parseFloat(<string>obj);
            }            
        } else {
            return 0;
        }
    }
}