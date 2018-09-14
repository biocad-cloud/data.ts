namespace Linq.DOM {

    /**
     * HTML文档节点的查询类型
    */
    export enum QueryTypes {
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

    export class Query {

        public type: QueryTypes;
        public singleNode: boolean;

        /**
         * Name of the return value is the trimmed expression
        */
        public expression: string;

        public static parseQuery(expr: string): Query {
            var isSingle: boolean = false;

            if (expr.charAt(0) == "&") {
                isSingle = true;
                expr = expr.substr(1);
            } else {
                isSingle = false;
            }

            return Query.parseExpression(expr, isSingle);
        }

        /**
         * by node id
        */
        private static getById(id: string): Query {
            return <Query>{
                type: QueryTypes.id,
                singleNode: true,
                expression: id
            };
        }

        /**
         * by class name
        */
        private static getByClass(className: string, isSingle: boolean): Query {
            return <Query>{
                type: QueryTypes.class,
                singleNode: isSingle,
                expression: className
            };
        }

        /**
         * by tag name
        */
        private static getByTag(tag: string, isSingle: boolean): Query {
            return <Query>{
                type: QueryTypes.tagName,
                singleNode: isSingle,
                expression: tag
            };
        }

        /**
         * create new node
        */
        private static createElement(expr: string): Query {
            return <Query>{
                type: QueryTypes.NoQuery,
                singleNode: true,
                expression: expr
            };
        }

        private static parseExpression(expr: string, isSingle: boolean): Query {
            var prefix: string = expr.charAt(0);

            if (expr.indexOf(" ") > -1) {
                // 可能是复杂查询表达式
                return <Query>{
                    type: QueryTypes.tagName,
                    singleNode: isSingle,
                    expression: expr
                };
            }

            switch (prefix) {
                case "#": return this.getById(expr.substr(1));
                case ".": return this.getByClass(expr, isSingle);
                case "<": return this.createElement(expr);
                default: return this.getByTag(expr, isSingle);
            }
        }
    }
}