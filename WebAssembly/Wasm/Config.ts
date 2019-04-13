namespace TypeScript {

    export interface Config {
        run: Delegate.Sub;
        imports?: {};
        api?: apiOptions;
    }

    export interface apiOptions {
        document?: boolean;
        console?: boolean;
    }
}