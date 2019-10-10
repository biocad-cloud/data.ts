/// <reference path="./sprintf.ts" />
/// <reference path="../../Collections/DictionaryMaps.ts" />

namespace TypeScript {

    export module URLPatterns {

        export const hostNamePattern: RegExp = /:\/\/(www[0-9]?\.)?(.[^/:]+)/i;

        /**
         * Regexp pattern for data uri string
        */
        export const uriPattern: RegExp = /data[:]\S+[/]\S+;base64,[a-zA-Z0-9/=+]/ig;
        /**
         * Regexp pattern for web browser url string
        */
        export const urlPattern: RegExp = /((https?)|(ftp))[:]\/{2}\S+\.[a-z]+[^ >"]*/ig;

        export function isFromSameOrigin(url: string): boolean {
            let URL = new TypeScript.URL(url);
            let origin1 = URL.origin.toLowerCase();
            let origin2 = window.location.origin.toLowerCase();

            return origin1 == origin2;
        }

        /**
         * 将URL查询字符串解析为字典对象，所传递的查询字符串应该是查询参数部分，即问号之后的部分，而非完整的url
         * 
         * @param queryString URL查询参数
         * @param lowerName 是否将所有的参数名称转换为小写形式？
         * 
         * @returns 键值对形式的字典对象
        */
        export function parseQueryString(queryString: string, lowerName: boolean = false): object {
            // stuff after # is not part of query string, so get rid of it
            // split our query string into its component parts
            var arr = queryString.split('#')[0].split('&');
            // we'll store the parameters here
            var obj = {};

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                var paramValue: string = typeof (a[1]) === 'undefined' ? "true" : a[1];

                if (lowerName) {
                    paramName = paramName.toLowerCase();
                }

                // if parameter name already exists
                if (obj[paramName]) {

                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }

                    if (typeof paramNum === 'undefined') {
                        // if no array index number specified...
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    } else {
                        // if array index number specified...
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                } else {
                    // if param name doesn't exist yet, set it
                    obj[paramName] = paramValue;
                }
            }

            return obj;
        }
    }

    /**
     * URL组成字符串解析模块
    */
    export class URL {

        /**
         * 域名
        */
        public origin: string;
        public port: number;

        /**
         * 页面的路径
         * 
         * 这是一个绝对路径来的
        */
        public path: string;
        /**
         * URL查询参数
        */
        public get query(): NamedValue<string>[] {
            return this.queryArguments.ToArray(false);
        };

        /**
         * 未经过解析的查询参数的原始字符串
        */
        public queryRawString: string;

        /**
         * 不带拓展名的文件名称
        */
        public fileName: string;
        /**
         * 在URL字符串之中``#``符号后面的所有字符串都是hash值
        */
        public hash: string;
        /**
         * 网络协议名称
        */
        public protocol: string;

        private queryArguments: IEnumerator<NamedValue<string>>;

        /**
         * 在这里解析一个URL字符串
        */
        public constructor(url: string) {
            // http://localhost/router.html#http://localhost/b.html
            var token = Strings.GetTagValue(url, "://");

            this.protocol = token.name; token = Strings.GetTagValue(token.value, "/");
            this.origin = token.name; token = Strings.GetTagValue(token.value, "?");
            this.path = token.name;
            this.fileName = Strings.Empty(this.path) ? "" : TsLinq.PathHelper.basename(this.path);
            this.hash = $from(url.split("#")).Last;

            if (url.indexOf("#") < 0) {
                this.hash = "";
            }

            if (!isNullOrUndefined(this.path)) {
                // 将页面的路径标准化
                // 应该是一个从wwwroot起始的绝对路径
                if (this.path.charAt(0) !== "/") {
                    this.path = `/${this.path}`;
                }
            } else {
                this.path = "/";
            }

            var args: object = URL.UrlQuery(token.value);

            this.queryRawString = token.value;
            this.queryArguments = Dictionary
                .MapSequence<string>(args)
                .Select(m => new NamedValue<string>(m.key, m.value));

            token = Strings.GetTagValue(this.origin, ":");

            this.origin = token.name;
            this.port = Strings.Val(token.value);

            if (this.port == 0) {
                this.port = this.protocol == "https" ? 443 : 80;
            }
        }

        public getArgument(queryName: string, caseSensitive: boolean = true, Default: string = ""): string {
            if (Strings.Empty(queryName, false)) {
                return "";
            } else if (!caseSensitive) {
                queryName = queryName.toLowerCase();
            }

            return this.queryArguments
                .Where(map => caseSensitive ? map.name == queryName : map.name.toLowerCase() == queryName)
                .FirstOrDefault(<any>{ value: Default })
                .value;
        }

        /**
         * 将URL之中的query部分解析为字典对象
        */
        public static UrlQuery(args: string): object {
            if (args) {
                return URLPatterns.parseQueryString(args, false);
            } else {
                return {};
            }
        }

        /**
         * 跳转到url之中的hash编号的文档位置处
         * 
         * @param hash ``#xxx``文档节点编号表达式
        */
        public static JumpToHash(hash: string) {
            // Getting Y of target element
            // Go there directly or some transition
            window.scrollTo(0, $ts(hash).offsetTop);
        }

        /**
         * Set url hash without url jump in document
        */
        public static SetHash(hash: string) {
            if (history.pushState) {
                history.pushState(null, null, hash);
            } else {
                location.hash = hash;
            }
        }

        /**
         * 获取得到当前的url
        */
        public static WindowLocation(): URL {
            return new URL(window.location.href);
        }

        public toString(): string {
            var query = $from(this.query)
                .Select(q => `${q.name}=${encodeURIComponent(q.value)}`)
                .JoinBy("&");
            var url = `${this.protocol}://${this.origin}/${this.path}`;

            if (query) {
                url = url + "?" + query;
            }
            if (this.hash) {
                url = url + "#" + this.hash;
            }

            return url;
        }

        public static Refresh(url: string): string {
            return `${url}&refresh=${Math.random() * 10000}`;
        }

        /**
         * 获取所给定的URL之中的host名称字符串，如果解析失败会返回空值
        */
        public static getHostName(url: string): string {
            var match: RegExpMatchArray = url.match(URLPatterns.hostNamePattern);

            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                return match[2];
            } else {
                return null;
            }
        }

        /** 
         * 将目标文本之中的所有的url字符串匹配出来
        */
        public static ParseAllUrlStrings(text: string): string[] {
            let urls: string[] = [];

            for (let url of Strings.getAllMatches(text, URLPatterns.urlPattern)) {
                urls.push(url[0]);
            }

            return urls;
        }

        public static IsWellFormedUriString(uri: string): boolean {
            var matches = uri.match(URLPatterns.uriPattern);

            if (isNullOrUndefined(matches)) {
                return false;
            }

            var match: string = matches[0];

            if (!Strings.Empty(match, true)) {
                return uri.indexOf(match) == 0;
            } else {
                return false;
            }
        }
    }
}