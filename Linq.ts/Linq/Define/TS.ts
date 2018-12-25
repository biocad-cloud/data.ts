namespace Internal {

    /**
     * The internal typescript symbol
    */
    export interface TypeScript {

        <T extends HTMLElement>(nodes: NodeListOf<T>): DOMEnumerator<T>;

        /**
         * Create a new node or query a node by its id.
         * (创建或者查询节点)
        */
        <T extends HTMLElement>(query: string, args?: TypeScriptArgument): IHTMLElement;
        /**
         * Query by class name or tag name
        */
        <T extends HTMLElement>(collectionQuery: string): DOMEnumerator<T>;

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

        post<T>(url: string, data: object | FormData, callback?: ((response: IMsg<T>) => void)): void;
        get<T>(url: string, callback?: ((response: IMsg<T>) => void)): void;
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