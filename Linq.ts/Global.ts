/// <reference path="Data/sprintf.ts" />
/// <reference path="Linq/Collections/Enumerator.ts" />
/// <reference path="Linq/TsQuery/TsQuery.ts" />
/// <reference path="Helpers/Extensions.ts" />
/// <reference path="Helpers/Strings.ts" />
/// <reference path="Type.ts" />
/// <reference path="Data/Encoder/MD5.ts" />

if (typeof String.prototype['startsWith'] != 'function') {
    String.prototype['startsWith'] = function (str) {
        return this.slice(0, str.length) == str;
    };
}

/**
 * 对于这个函数的返回值还需要做类型转换
 * 
 * 如果是节点查询或者创建的话，可以使用``asExtends``属性来获取``HTMLTsElememnt``拓展对象
*/
function $ts<T>(any: (() => void) | T | T[], args: object = null): IEnumerator<T> | void | any {
    var type: TypeInfo = TypeInfo.typeof(any);
    var typeOf: string = type.typeOf;
    var handle = Linq.TsQuery.handler;
    var eval: any = typeOf in handle ? handle[typeOf]() : null;

    if (type.IsArray) {
        // 转化为序列集合对象，相当于from函数
        var creator = <Linq.TsQuery.arrayEval<T>>eval;
        return <IEnumerator<T>>creator.doEval(<T[]>any, type, args);
    } else if (type.typeOf == "function") {
        // 当html文档加载完毕之后就会执行传递进来的这个
        // 函数进行初始化
        Linq.DOM.ready(<() => void>any);
    } else {
        // 对html文档之中的节点元素进行查询操作
        // 或者创建新的节点
        return (<Linq.TsQuery.IEval<T>>eval).doEval(<T>any, type, args);
    }
}

/**
 * 动态加载脚本文件，然后在完成脚本文件的加载操作之后，执行一个指定的函数操作
 * 
 * @param callback 如果这个函数之中存在有HTML文档的操作，则可能会需要将代码放在``$ts(() => {...})``之中，
 *     等待整个html文档加载完毕之后再做程序的执行，才可能会得到正确的执行结果
*/
function $imports(jsURL: string | string[],
    callback: () => void = DoNothing,
    onErrorResumeNext: boolean = false): void {

    return new HttpHelpers
        .Imports(jsURL, onErrorResumeNext)
        .doLoad(callback);
}

/**
 * 计算字符串的MD5值字符串
*/
function md5(string: string, key: string = null, raw: string = null): string {
    return MD5.calculate(string, key, raw);
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

/**
 * 将一个给定的字符串转换为组成该字符串的所有字符的枚举器
*/
function CharEnumerator(str: string): IEnumerator<string> {
    return new IEnumerator<string>(Strings.ToCharArray(str));
}

/**
 * Query meta tag content value by name
 * 
 * @param allowQueryParent 当当前的文档之中不存在目标meta标签的时候，
 *    如果当前文档为iframe文档，则是否允许继续往父节点的文档做查询？
 *    默认为False，即只在当前文档环境之中进行查询操作
 * @param Default 查询失败的时候所返回来的默认值
*/
function metaValue(name: string, Default: string = null, allowQueryParent: boolean = false): string {
    var selector: string = `meta[name~="${name}"]`;
    var meta: Element = document.querySelector(selector);
    var getContent = function () {
        if (meta) {
            var content: string = meta.getAttribute("content");
            return content ? content : Default;
        } else {
            return Default;
        }
    };

    if (!meta && allowQueryParent) {
        meta = parent.window
            .document
            .querySelector(selector);
    }

    return getContent();
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
 * 查看目标变量的对象值是否是空值或者未定义
*/
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

/**
 * 调用这个函数会从当前的页面跳转到指定URL的页面
 * 
 * 如果当前的这个页面是一个iframe页面，则会通过父页面进行跳转
 * 
 * @param currentFrame 如果这个参数为true，则不会进行父页面的跳转操作
*/
function Goto(url: string, currentFrame: boolean = false): void {
    var win: Window = window;

    if (!currentFrame) {
        // 一直递归到最顶层的文档页面
        while (win.parent) {
            win = win.parent;
        }
    }

    win.location.href = url;
}

/**
 * 这个函数会自动处理多行的情况
*/
function base64_decode(stream: string): string {
    var data: string[] = Strings.lineTokens(stream);
    var base64Str: string = From(data)
        .Where(s => s && s.length > 0)
        .Select(s => s.trim())
        .JoinBy("");
    var text: string = Base64.decode(base64Str);

    return text;
}

/**
 * 这个函数什么也不做，主要是用于默认的参数值
*/
function DoNothing(): any {
    return null;
}

/**
 * 将指定的SVG节点保存为png图片
 * 
 * @param svg 需要进行保存为图片的svg节点的对象实例或者对象的节点id值
 * @param name 所保存的文件名
 * @param options 配置参数，直接留空使用默认值就好了
*/
function saveSvgAsPng(
    svg: string | SVGElement,
    name: string,
    options: CanvasHelper.saveSvgAsPng.Options = null) {

    return CanvasHelper.saveSvgAsPng.Encoder.saveSvgAsPng(svg, name, options);
}