namespace DOM {

    export module InputValueGetter {

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

        }

        export function selectOptions(input: HTMLSelectElement): any {

        }

        export function largeText(text: HTMLTextAreaElement): any {

        }
    }
}