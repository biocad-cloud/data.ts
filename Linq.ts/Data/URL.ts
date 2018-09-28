namespace TsLinq {

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
        public query: NamedValue<string>[];
        /**
         * 不带拓展名的文件名称
        */
        public fileName: string;
        public hash: string;
        public protocol: string;

        public constructor(url: string) {
            // http://localhost/router.html#http://localhost/b.html
            var token = Strings.GetTagValue(url, "://");

            this.protocol = token.name;
            token = Strings.GetTagValue(token.value, "/");
            this.origin = token.name;
            token = Strings.GetTagValue(token.value, "?");
            this.path = token.name;
            this.fileName = From(this.path.split("/")).Last;
            this.hash = From(url.split("#")).Last;
            this.query = new Dictionary<string>(DataExtensions.parseQueryString(token.value, false))
                .Select(m => new NamedValue<string>(m.key, m.value))
                .ToArray();
        }

        public static WindowLocation(): URL {
            return new URL(window.location.href);
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
    }
}