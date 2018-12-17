namespace Internal {

    export interface TypeScript {

        /**
         * 创建或者查询节点
        */
        <T extends HTMLElement>(query: string, args?: TypeScriptArgument): IHTMLElement;
        <T extends HTMLElement>(collectionQuery: string): DOMEnumerator<T>;
        <T>(array: T[]): IEnumerator<T>;

        /**
         * Handles event on document load ready.
         * 
         * @param ready The handler of the target event.
        */
        (ready: () => void): void;
    }

    /**
     * 这个参数对象模型主要是针对创建HTML对象的
    */
    export interface TypeScriptArgument {
        id?: string;
        style?: string;
        class?: string;
        type?: string;
        href?: string;
        src?: string;
        width?: string | number;
        height?: string | number;
        context?: Window;
    }
}