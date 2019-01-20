﻿/// <reference path="./sprintf.ts" />

namespace TsLinq {

    export module URLPatterns {

        export const hostNamePattern: RegExp = /:\/\/(www[0-9]?\.)?(.[^/:]+)/i;
        export const uriPattern: RegExp = /data[:]\S+[/]\S+;base64,[a-zA-Z0-9/=+]/ig;

    }

    /**
     * URL组成字符串解析模块
    */
    export class URL {

        /**
         * 域名
        */
        public origin: string;
        /**
         * 页面的路径
        */
        public path: string;
        /**
         * URL查询参数
        */
        public get query(): NamedValue<string>[] {
            return this.queryArguments.ToArray(false);
        };

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
            this.fileName = Strings.Empty(this.path) ? "" : PathHelper.basename(this.path);
            this.hash = From(url.split("#")).Last;

            if (url.indexOf("#") < 0) {
                this.hash = "";
            }

            var args: object = URL.UrlQuery(token.value);

            this.queryArguments = Dictionary
                .MapSequence<string>(args)
                .Select(m => new NamedValue<string>(m.key, m.value));
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
                return DataExtensions.parseQueryString(args, false);
            } else {
                return {};
            }
        }

        /**
         * 获取得到当前的url
        */
        public static WindowLocation(): URL {
            return new URL(window.location.href);
        }

        /**
         * 对bytes数值进行格式自动优化显示
         * 
         * @param bytes 
         * 
         * @return 经过自动格式优化过后的大小显示字符串
        */
        public static Lanudry(bytes: number): string {
            var symbols = ["B", "KB", "MB", "GB", "TB"];
            var exp = Math.floor(Math.log(bytes) / Math.log(1000));
            var symbol: string = symbols[exp];
            var val = (bytes / Math.pow(1000, Math.floor(exp)));

            return sprintf(`%.2f ${symbol}`, val);
        }

        public toString(): string {
            var query = From(this.query)
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