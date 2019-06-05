namespace DOM {

    export module InputValueGetter {

        /**
         * Query meta tag content value by name
         * 
         * @param allowQueryParent 当当前的文档之中不存在目标meta标签的时候，
         *    如果当前文档为iframe文档，则是否允许继续往父节点的文档做查询？
         *    默认为False，即只在当前文档环境之中进行查询操作
         * @param Default 查询失败的时候所返回来的默认值
        */
        export function metaValue(name: string, Default: string = null, allowQueryParent: boolean = false): string {
            var selector: string = `meta[name~="${name}"]`;
            var meta: Element = document.querySelector(selector);
            var getContent = function () {
                if (meta) {
                    var content: string = meta.getAttribute("content");
                    return content ? content : Default;
                } else {
                    if (TypeScript.logging.outputWarning) {
                        console.warn(`${selector} not found in current context!`);
                    }

                    return Default;
                }
            };

            if (!meta && allowQueryParent) {
                meta = parent.window
                    .document
                    .querySelector(selector);
            }

            return getContent();
        }

        export function getValue(id: string, strict: boolean = true): any {
            let input = $ts(Internal.Handlers.EnsureNodeId(id));

            switch (input.tagName) {
                case "input": return inputValue(<any>input);
                case "select": return selectOptions(<any>input);
                case "textarea": return largeText(<any>input);

                default:
                    if (strict) {
                        throw `Get value of <${input.tagName}> is not supported!`;
                    } else {
                        // 强制读取目标节点的value属性值
                        return input.getAttribute("value");
                    }
            }
        }

        export function inputValue(input: HTMLInputElement): any {
            if (input.type == "checkbox") {
                return input.checked;
            } else {
                return input.value;
            }
        }

        export function selectOptions(input: HTMLSelectElement): any {

        }

        export function largeText(text: HTMLTextAreaElement): any {

        }
    }
}