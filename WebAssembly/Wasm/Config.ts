namespace TypeScript {

    export interface Config {
        /**
         * A lambda function for run your VisualBasic.NET application.
        */
        run: Delegate.Sub;
        /**
         * Your custom javascript api that imports for your VisualBasic app, like:
         * 
         * 1. third-part javascript library, 
         * 2. the WebAssembly module export api which comes from another VisualBasic.NET or C/C++ application
         * 3. WebGL, Unity api etc for game development in VisualBasic.NET 
        */
        imports?: {};
        /**
         * Options for javascript build-in api
        */
        api?: apiOptions;
        /**
         * The VB.NET application memory configuration.
        */
        page: {
            init?: number,
            /**
             * Config max memory page size for your VB.NET app
            */
            max?: number
        }
    }

    /**
     * The javascript internal api imports option for VB.NET WebAssembly
    */
    export interface apiOptions {
        /**
         * Add javascript html document api imports for VB.NET?
        */
        document?: boolean;
        /**
         * Add javascript debugger console api imports for VB.NET?
        */
        console?: boolean;
        /**
         * Add javascript http request api like get/post or WebSocket api imports for VB.NET?
        */
        http?: boolean;
        /**
         * Add string and text api from javascript, like String and RegExp imports for VB.NET?
        */
        text?: boolean;
        array?: boolean;
    }
}