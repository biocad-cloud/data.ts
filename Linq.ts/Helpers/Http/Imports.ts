namespace HttpHelpers {

    export class Imports {

        private errors: string[];
        private jsURL: string[];
        private i: number = 0;

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