namespace Internal {

    export interface TypeScript {

        /**
         * 创建或者查询节点
        */
        <T extends HTMLElement>(query: string, args?: TypeScriptArgument): IHTMLElement;
        <T extends HTMLElement>(collectionQuery: string): DOMEnumerator<T>;
        <T extends HTMLElement>(nodes: NodeListOf<T>): DOMEnumerator<T>;
        <T>(array: T[]): IEnumerator<T>;

        (meta: string): string;

        /**
         * Handles event on document load ready.
         * 
         * @param ready The handler of the target event.
        */
        (ready: () => void): void;

        imports(jsURL: string | string[], callback?: () => void, onErrorResumeNext?: boolean, echo?: boolean): void;
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
    }
}