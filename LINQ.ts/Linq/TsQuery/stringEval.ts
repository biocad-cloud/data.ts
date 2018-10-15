namespace Linq.TsQuery {

    /**
     * 字符串格式的值意味着对html文档节点的查询
    */
    export class stringEval implements IEval<string> {

        doEval(expr: string, type: TypeInfo, args: object): any {
            var query: DOM.Query = DOM.Query.parseQuery(expr);
            var argument: Arguments = args ? <Arguments>args : Arguments.Default();

            if (query.type == DOM.QueryTypes.id) {
                // 按照id查询
                var node: HTMLElement = document.getElementById(query.expression);

                if (argument.nativeModel) {
                    return stringEval.extends(node);
                } else {
                    return new HTMLTsElement(node);
                }
            } else if (query.type == DOM.QueryTypes.NoQuery) {
                return stringEval.createNew(expr, argument);
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
         * 在原生节点模式之下对输入的给定的节点对象添加拓展方法
         * 
         * 向HTML节点对象的原型定义之中拓展新的方法和成员属性
         * 这个函数的输出在ts之中可能用不到，主要是应用于js脚本
         * 编程之中
         * 
         * @param node 当查询失败的时候是空值
        */
        private static extends(node: HTMLElement): HTMLElement {
            var obj: any = node;

            if (isNullOrUndefined(node)) {
                return null;
            }

            var extendsNode: HTMLTsElement = new HTMLTsElement(node);

            /**
             * 这个拓展函数总是会将节点中的原来的内容清空，然后显示html函数参数
             * 所给定的内容
            */
            obj.display = function (html: string | HTMLElement) {
                extendsNode.display(html);
                return node;
            };
            obj.show = function () {
                extendsNode.show();
                return node;
            };
            obj.hide = function () {
                extendsNode.hide();
                return node;
            }
            obj.addClass = function (name: string) {
                extendsNode.addClass(name);
                return node;
            }
            obj.removeClass = function (name: string) {
                extendsNode.removeClass(name);
                return node;
            }

            // 用这个方法可以很方便的从现有的节点进行转换
            // 也可以直接使用new进行构造
            obj.asExtends = extendsNode;

            return node;
        }

        /**
         * 创建新的HTML节点元素
        */
        public static createNew(expr: string, args: Arguments): HTMLElement | HTMLTsElement {
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

            if (args.nativeModel) {
                return stringEval.extends(node);
            } else {
                return new HTMLTsElement(node);
            }
        }
    }
}