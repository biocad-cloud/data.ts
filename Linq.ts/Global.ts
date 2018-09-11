/// <reference path="Linq/Collections/Enumerator.ts" />
/// <reference path="Helpers/Extensions.ts" />

/**
 * 对于这个函数的返回值还需要做类型转换
*/
function $ts<T>(any: (() => void) | T | T[]): IEnumerator<T> & any {
    var type: TypeInfo = TypeInfo.typeof(any);
    var typeOf: string = type.typeOf;
    var handle = Linq.TsQuery.handler;
    var eval: any = typeOf in handle ? handle[typeOf]() : null;

    if (type.IsArray) {
        return (<Linq.TsQuery.arrayEval<T>>eval).doEval(<T[]>any, type);
    } else if (type.typeOf == "function") {
        Linq.DOM.ready(<() => void>any);
    } else {
        return (<Linq.TsQuery.IEval<T>>eval).doEval(<T>any, type);
    }
}

/**
 * Linq数据流程管线的起始函数
 * 
 * @param source 需要进行数据加工的集合对象
*/
function From<T>(source: T[] | IEnumerator<T>): IEnumerator<T> {
    return new IEnumerator<T>(source);
}

function CharEnumerator(str: string): IEnumerator<string> {
    return new IEnumerator<string>(Strings.ToCharArray(str));
}

/**
 * 判断目标对象集合是否是空的？
 * 
 * @param array 如果这个数组对象是空值或者未定义，都会被判定为空，如果长度为零，则同样也会被判定为空值
*/
function IsNullOrEmpty<T>(array: T[] | IEnumerator<T>): boolean {
    if (array == null || array == undefined) {
        return true;
    } else if (Array.isArray(array) && array.length == 0) {
        return true;
    } else if ((<IEnumerator<T>>(<any>array)).Count == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * HTML/Javascript: how to access JSON data loaded in a script tag.
*/
function LoadJson(id: string): any {
    return JSON.parse(LoadText(id));
}

function LoadText(id: string): string {
    return document.getElementById(id).textContent;
}

/**
 * Quick Tip: Get URL Parameters with JavaScript
 * 
 * > https://www.sitepoint.com/get-url-parameters-with-javascript/
 * 
 * @param url get query string from url (optional) or window
*/
function getAllUrlParams(url: string = window.location.href): Dictionary<string> {
    var queryString: string = url.split('?')[1];

    if (queryString) {
        // if query string exists
        return new Dictionary<string>(DataExtensions.parseQueryString(queryString));
    } else {
        return new Dictionary<string>({});
    }
}