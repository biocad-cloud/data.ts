interface TypeScript {

    /**
     * 创建或者查询节点
    */
    <T extends HTMLElement>(query: string, args?: TypeScriptArgument): HTMLElement | DOMEnumerator<T>;
    <T>(array: T[]): IEnumerator<T>;

    /**
     * Handles event on document load ready.
     * 
     * @param ready The handler of the target event.
    */
    (ready: () => void): void;
}

interface TypeScriptArgument {
    id?: string;
    style?: string;
    class?: string;
}