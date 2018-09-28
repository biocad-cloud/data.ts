/// <reference path="Data/sprintf.ts" />
/// <reference path="Linq/Collections/Enumerator.ts" />
/// <reference path="Linq/TsQuery.ts" />
/// <reference path="Helpers/Extensions.ts" />
/// <reference path="Helpers/Strings.ts" />
/// <reference path="Type.ts" />

/**
 * 对于这个函数的返回值还需要做类型转换
*/
function $ts<T>(any: (() => void) | T | T[], args: object = null): IEnumerator<T> & any {
    var type: TypeInfo = TypeInfo.typeof(any);
    var typeOf: string = type.typeOf;
    var handle = Linq.TsQuery.handler;
    var eval: any = typeOf in handle ? handle[typeOf]() : null;

    if (type.IsArray) {
        return (<Linq.TsQuery.arrayEval<T>>eval).doEval(<T[]>any, type, args);
    } else if (type.typeOf == "function") {
        Linq.DOM.ready(<() => void>any);
    } else {
        return (<Linq.TsQuery.IEval<T>>eval).doEval(<T>any, type, args);
    }
}

/**
 * ### Javascript sprintf
 * 
 * > http://www.webtoolkit.info/javascript-sprintf.html#.W5sf9FozaM8
 *  
 * Several programming languages implement a sprintf function, to output a 
 * formatted string. It originated from the C programming language, printf 
 * function. Its a string manipulation function.
 *
 * This is limited sprintf Javascript implementation. Function returns a 
 * string formatted by the usual printf conventions. See below for more details. 
 * You must specify the string and how to format the variables in it.
*/
const sprintf = data.sprintf.doFormat;

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

function isNullOrUndefined(obj: any): boolean {
    if (obj == null || obj == undefined) {
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
    if (url.indexOf("?") > -1) {
        // if query string exists
        var queryString: string = Strings.GetTagValue(url, '?').value;
        var args = DataExtensions.parseQueryString(queryString)
        return new Dictionary<string>(args);
    } else {
        return new Dictionary<string>({});
    }
}