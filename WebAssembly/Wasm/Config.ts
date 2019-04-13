namespace TypeScript {

    export interface Config {
        run: Delegate.Sub;
        imports?: {};
        api?: apiOptions;
        page: { init?: number, max?: number }
    }

    export interface apiOptions {
        document?: boolean;
        console?: boolean;
        http?: boolean;
    }
}