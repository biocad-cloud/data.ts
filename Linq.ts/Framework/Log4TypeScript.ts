namespace TypeScript {

    const warningLevel: number = Modes.development;
    const anyoutputLevel: number = Modes.debug;
    const errorOnly: number = Modes.production;

    /**
     * Console logging helper
    */
    export abstract class logging {

        private constructor() {
        }

        /**
         * 应用程序的开发模式：只会输出框架的警告信息
        */
        public static get outputWarning(): boolean {
            return $ts.mode <= warningLevel;
        }

        /**
         * 框架开发调试模式：会输出所有的调试信息到终端之上
        */
        public static get outputEverything(): boolean {
            return $ts.mode == anyoutputLevel;
        }

        /**
         * 生产模式：只会输出错误信息
        */
        public static get outputError(): boolean {
            return $ts.mode == errorOnly;
        }

        public static log(obj, color: string = "black") {
            if (this.outputEverything) {
                console.log(obj);
            }
        }

        public static runGroup(title: string, program: Delegate.Sub): void {
            let startTime: number = Date.now();

            console.group(title);
            program();
            console.groupEnd();

            let endTime: number = Date.now();
            let costTime: number = endTime - startTime;

            logging.log(`Program '${title}' cost ${costTime}ms to run.`, "darkblue");
        }
    }
}