namespace Linq.TsQuery {

    export const handler = {
        /**
         * HTML document query handler
        */
        string: () => new stringEval(),
        /**
         * Create a linq object
        */
        array: () => new arrayEval()
    };

    export interface IEval<T> {
        doEval(expr: T, type: TypeInfo): any;
    }

    export class stringEval implements IEval<string> {

        /**
         * name of the return value is the trimmed expression
        */
        public static getQueryType(expr: string): NamedValue<DomQueryTypes> {
            if (expr.charAt(0) == "#") {
                return new NamedValue<DomQueryTypes>(expr.substr(1), DomQueryTypes.id);
            } else if (expr.charAt(0) == ".") {
                return new NamedValue<DomQueryTypes>(expr.substr(1), DomQueryTypes.class);
            } else {
                return new NamedValue<DomQueryTypes>(expr, DomQueryTypes.tagName);
            }
        }

        doEval(expr: string, type: TypeInfo): any {
            var query = stringEval.getQueryType(expr);

            // console.log(query);
            // console.log(query.value == DomQueryTypes.id);

            if (query.value == DomQueryTypes.id) {
                return document.getElementById(query.name);
            } else {
                return new DOM.DOMEnumerator<HTMLElement>(document.querySelectorAll(expr));
            }
        }
    }

    /**
     * HTML文档节点的查询类型
    */
    export enum DomQueryTypes {
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

    /**
     * Create a Linq Enumerator
    */
    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo): any {
            return From(expr);
        }
    }
}