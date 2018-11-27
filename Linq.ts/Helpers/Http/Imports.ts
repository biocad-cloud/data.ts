namespace HttpHelpers {

    /**
     * Javascript动态加载帮助函数
    */
    export class Imports {

        /**
         * 发生加载错误的脚本，例如404，脚本文件不存在等错误
        */
        private errors: string[];
        private jsURL: string[];
        private i: number = 0;

        /**
         * @param modules javascript脚本文件的路径集合
        */
        public constructor(modules: string | string[]) {
            if (typeof modules == "string") {
                this.jsURL = [modules];
            } else {
                this.jsURL = modules;
            }
        }

        private nextScript(): string {
            var url: string = this.jsURL[this.i++];
            return url;
        }

        /**
         * 开始进行异步的脚本文件加载操作
         * 
         * @param callback 在所有指定的脚本文件都完成了加载操作之后所调用的异步回调函数
        */
        doLoad(callback: () => void): void {
            var url: string = this.nextScript();
            var imports = this;

            if (Strings.Empty(url, true)) {
                // 已经加载完所有的脚本了
                // 执行callback
                callback();
            } else {
                HttpHelpers.GetAsyn(url, (script, code) => {
                    // 完成向服务器的数据请求操作之后
                    // 加载代码文本
                    switch (code) {
                        case 200:
                            eval.apply(window, [script]);
                            console.log("script loaded: ", url);
                            break;
                        default:
                            imports.errors.push(url);
                            console.error("ERROR: script not loaded: ", url);
                    }

                    imports.doLoad(callback);
                });
            }
        }
    }
}