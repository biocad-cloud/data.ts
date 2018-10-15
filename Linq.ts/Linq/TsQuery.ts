
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
        doEval(expr: T, type: TypeInfo, args: object): any;
    }

    /**
     * 字符串格式的值意味着对html文档节点的查询
    */
    export class stringEval implements IEval<string> {

        doEval(expr: string, type: TypeInfo, args: object): any {
            var query: DOM.Query = DOM.Query.parseQuery(expr);

            if (query.type == DOM.QueryTypes.id) {
                // 按照id查询
                return stringEval.extends(document.getElementById(query.expression));
            } else if (query.type == DOM.QueryTypes.NoQuery) {
                return stringEval.createNew(expr, args);
            } else if (!query.singleNode) {
                // 返回节点集合
                var nodes = <NodeListOf<HTMLElement>>document
                    .querySelectorAll(query.expression);
                var it = new DOM.DOMEnumerator(nodes);

                return it;
            } else if (query.type == DOM.QueryTypes.QueryMeta) {
                return metaValue(query.expression, (args || {})["default"]);
            } else {
                // 只返回第一个满足条件的节点
                return document.querySelector(query.expression);
            }
        }

        /**
         * 向HTML节点对象的原型定义之中拓展新的方法和成员属性
         * 这个函数的输出在ts之中可能用不到，主要是应用于js脚本
         * 编程之中
        */
        private static extends(node: HTMLElement): HTMLTsElement {
            if (isNullOrUndefined(node)) {
                return null;
            } else {
                return new HTMLTsElement(node);
            }
        }

        /**
         * 创建新的HTML节点元素
        */
        public static createNew(expr: string, args: object): HTMLTsElement {
            var declare = DOM.ParseNodeDeclare(expr);
            var node: HTMLElement = document.createElement(declare.tag);

            declare.attrs.forEach(attr => {
                node.setAttribute(attr.name, attr.value);
            });

            if (args) {
                Object.keys(args).forEach(name => {
                    node.setAttribute(name, <string>args[name]);
                });
            }

            return stringEval.extends(node);
        }
    }

    /**
     * Create a Linq Enumerator
    */
    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo, args: object): any {
            return From(expr);
        }
    }
}