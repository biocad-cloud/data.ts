namespace Linq.DOM {

    /**
     * HTML文档节点的查询类型
    */
    export enum DomQueryTypes {
        NoQuery = 0,
        /**
         * 表达式为 #xxx
         * 按照节点的id编号进行查询
         * 
         * ``<tag id="xxx">``
        */
        id = 1,
        /**
         * 表达式为 .xxx
         * 按照节点的class名称进行查询
         * 
         * ``<tag class="xxx">``
        */
        class = 10,
        /**
         * 表达式为 xxx
         * 按照节点的名称进行查询
         * 
         * ``<xxx ...>``
        */
        tagName = -100
    }

    export class DOMQuery {

        public type: DomQueryTypes;
        public singleNode: boolean;

        /**
         * Name of the return value is the trimmed expression
        */
        public expression: string;

        public static parseQuery(expr: string): DOMQuery {
            var isSingle: boolean = false;

            if (expr.charAt(0) == "&") {
                isSingle = true;
                expr = expr.substr(1);
            } else {
                isSingle = false;
            }

            return DOMQuery.parseExpression(expr, isSingle);
        }

        /**
         * by node id
        */
        private static getById(id: string): DOMQuery {
            return <DOMQuery>{
                type: DomQueryTypes.id,
                singleNode: true,
                expression: id
            };
        }

        /**
         * by class name
        */
        private static getByClass(className: string, isSingle: boolean): DOMQuery {
            return <DOMQuery>{
                type: DomQueryTypes.class,
                singleNode: isSingle,
                expression: className
            };
        }

        /**
         * by tag name
        */
        private static getByTag(tag: string, isSingle: boolean): DOMQuery {
            return <DOMQuery>{
                type: DomQueryTypes.tagName,
                singleNode: isSingle,
                expression: tag
            };
        }

        /**
         * create new node
        */
        private static createElement(expr: string): DOMQuery {
            return <DOMQuery>{
                type: DomQueryTypes.NoQuery,
                singleNode: true,
                expression: expr
            };
        }

        private static parseExpression(expr: string, isSingle: boolean): DOMQuery {
            var prefix: string = expr.charAt(0);

            switch (prefix) {
                case "#": return this.getById(expr.substr(1));
                case ".": return this.getByClass(expr.substr(1), isSingle);
                case "<": return this.createElement(expr);
                default: return this.getByTag(expr, isSingle);
            }
        }
    }
}