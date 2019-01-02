namespace Internal {

    /**
     * The internal typescript symbol
    */
    export interface TypeScript {

        /**
         * 这个属性控制着这个框架的调试器的输出行为
         * 
         * + 如果这个参数为true，则会在浏览器的console上面输出各种和调试相关的信息
         * + 如果这个参数为false，则不会再浏览器的console上面输出调试相关的信息，你会得到一个比较干净的console输出窗口
        */
        FrameworkDebug: boolean;

        <T extends HTMLElement>(nodes: NodeListOf<T>): DOMEnumerator<T>;

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
        select<T extends HTMLElement>(query: string, context?: Window): DOMEnumerator<T>;

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

        imports(jsURL: string | string[], callback?: () => void, onErrorResumeNext?: boolean, echo?: boolean): void;
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
        From<T>(seq: T[]): IEnumerator<T>;

        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
        */
        post<T>(url: string, data: object | FormData,
            callback?: ((response: IMsg<T>) => void),
            options?: {
                sendContentType?: boolean
            }): void;
        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
        */
        get<T>(url: string, callback?: ((response: IMsg<T>) => void)): void;

        /**
         * 针对csv数据序列的操作帮助对象
        */
        csv: IcsvHelperApi;
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
        class?: string;
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
    }
}