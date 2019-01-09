﻿namespace Internal {

    /**
     * The internal typescript symbol
    */
    export interface TypeScript {

        /**
         * 这个属性控制着这个框架的调试器的输出行为
         * 
         * + 如果这个参数为``debug``，则会在浏览器的console上面输出各种和调试相关的信息
         * + 如果这个参数为``production``，则不会在浏览器的console上面输出调试相关的信息，你会得到一个比较干净的console输出窗口
        */
        mode: Modes;

        <T extends HTMLElement>(nodes: NodeListOf<T>): DOMEnumerator<T>;
        <T extends HTMLElement & Node & ChildNode>(nodes: NodeListOf<T>): DOMEnumerator<T>;

        /**
         * Create a new node or query a node by its id.
         * (创建或者查询节点)
        */
        <T extends HTMLElement>(query: string, args?: TypeScriptArgument): IHTMLElement;

        /**
         * Query by class name or tag name
         * 
         * @param query A selector expression
        */
        select: IquerySelector;

        <T>(array: T[]): IEnumerator<T>;

        /**
         * query meta tag by name attribute value for its content.
         * 
         * @param meta The meta tag name, it should be start with a ``@`` symbol.
        */
        (meta: string): string;

        /**
         * Handles event on document load ready.
         * 
         * @param ready The handler of the target event.
        */
        (ready: () => void): void;

        /**
         * 动态的导入脚本
         * 
         * @param jsURL 需要进行动态导入的脚本的文件链接路径
         * @param onErrorResumeNext 当加载出错的时候，是否继续执行下一个脚本？如果为false，则出错之后会抛出错误停止执行
        */
        imports(jsURL: string | string[], callback?: () => void, onErrorResumeNext?: boolean, echo?: boolean): void;

        /**
         * 动态加载脚本
         * 
         * @param script 脚本的文本内容
         * @param lzw_decompress 目标脚本内容是否是lzw压缩过后的内容，如果是的话，则这个函数会进行lzw解压缩
        */
        eval(script: string, lzw_decompress?: boolean, callback?: () => void): void;

        /**
         * @param id HTML元素的id，可以同时兼容编号和带``#``的编号
        */
        loadJSON(id: string): any;
        /**
         * @param id HTML元素的id，可以同时兼容编号和带``#``的编号
        */
        loadText(id: string): string;

        /**
         * isNullOrUndefined
        */
        isNullOrEmpty(obj: any): boolean;
        /**
         * 判断目标集合是否为空
        */
        isNullOrEmpty<T>(list: T[] | IEnumerator<T>): boolean;
        /**
         * Linq函数链的起始
        */
        from<T>(seq: T[]): IEnumerator<T>;

        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
         * 
         * @param url 目标数据源，这个参数也支持meta标签的查询语法
        */
        post<T>(url: string, data: object | FormData,
            callback?: ((response: IMsg<T>) => void),
            options?: {
                sendContentType?: boolean
            }): void;
        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
         * 
         * @param url 目标数据源，这个参数也支持meta标签查询语法
        */
        get<T>(url: string, callback?: ((response: IMsg<T>) => void)): void;
        /**
         * File upload helper
         * 
         * @param url 目标数据源，这个参数也支持meta标签查询语法
        */
        upload<T>(url: string, file: File, callback?: ((response: IMsg<T>) => void)): void;

        /**
         * 获取当前的页面的URL字符串解析模型
        */
        windowLocation(): TsLinq.URL;
        /**
         * 解析一个给定的URL字符串
        */
        parseURL(url: string): TsLinq.URL;
        /**
         * 从当前页面跳转到给定的链接页面
         * 
         * @param url 链接，也支持meta查询表达式
         * @param currentFrame 如果当前页面为iframe的话，则只跳转iframe的显示，当这个参数为真的话；
         *      如果这个参数为false，则从父页面进行跳转
        */
        goto(url: string, currentFrame?: boolean, lambda?: boolean): Delegate.Sub;

        /**
         * 针对csv数据序列的操作帮助对象
        */
        csv: IcsvHelperApi;

        /**
         * 解析的结果为``filename.ext``的完整文件名格式
         * 
         * @param path Full name
        */
        parseFileName(path: string): string;
        /**
         * 得到不带有拓展名的文件名部分的字符串
         * 
         * @param path Full name
        */
        baseName(path: string): string;
        /**
         * 得到不带小数点的文件拓展名字符串
         * 
         * @param path Full name
        */
        extensionName(path: string): string;

        /**
         * 注意：这个函数是大小写无关的
         * 
         * @param path 文件路径字符串 
         * @param ext 不带有小数点的文件拓展名字符串
        */
        withExtensionName(path: string, ext: string): boolean;
    }

    export interface IquerySelector {
        <T extends HTMLElement>(query: string, context?: Window): DOMEnumerator<T>;

        /**
         * query参数应该是节点id查询表达式
        */
        getSelectedOptions(query: string, context?: Window): DOMEnumerator<HTMLOptionElement>;
        /**
         * 获取得到select控件的选中的选项值，没做选择则返回null
         * 
         * @param query id查询表达式，这个函数只支持单选模式的结果，例如select控件以及radio控件
         * @returns 返回被选中的项目的value属性值
        */
        getOption(query: string, context?: Window): string;
    }

    export interface IcsvHelperApi {

        /**
         * 将csv文档文本进行解析，然后反序列化为js对象的集合
        */
        toObjects<T>(data: string): IEnumerator<T>;
        /**
         * 将js的对象序列进行序列化，构建出csv格式的文本文档字符串数据
        */
        toText<T>(data: IEnumerator<T> | T[]): string;
    }

    /**
     * 这个参数对象模型主要是针对创建HTML对象的
    */
    export interface TypeScriptArgument {
        /**
         * HTML节点对象的编号（通用属性）
        */
        id?: string;
        /**
         * HTML节点对象的CSS样式字符串（通用属性）
        */
        style?: string;
        /**
         * HTML节点对象的class类型（通用属性）
        */
        class?: string | string[];
        type?: string;
        href?: string;
        target?: string;
        src?: string;
        width?: string | number;
        height?: string | number;
        /**
         * 进行查询操作的上下文环境，这个主要是针对iframe环境之中的操作的
        */
        context?: Window;
        title?: string;
        name?: string;
        /**
         * HTML的输入控件的预设值
        */
        value?: string | number | boolean;
        for?: string;

        /**
         * 处理HTML节点对象的点击事件，这个属性值应该是一个无参数的函数来的
        */
        onclick?: () => void;

        "data-toggle"?: string;
        "data-target"?: string;
        "aria-hidden"?: boolean;
    }
}