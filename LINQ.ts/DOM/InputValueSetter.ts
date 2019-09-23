namespace DOM {

    export module InputValueSetter {

        /**
         * @param resource name or id
         * 
         * @param strict 这个参数主要是针对非输入类型的控件的值获取而言的。
         * 如果目标id标记的控件不是输入类型的，则如果处于非严格模式下，
         * 即这个参数为``false``的时候会直接强制读取value属性值
        */
        export function setValue(resource: string, value: string, strict: boolean = true) {
            let input = $ts(resource);
            let type: TypeInfo = TypeInfo.typeof(input);

            if (type.isEnumerator) {
                setValues(new DOMEnumerator<IHTMLElement>(<any>input), value, strict);
            } else {
                switch (input.tagName.toLowerCase()) {
                    case "input":
                        input.asInput.value = value;
                        break;

                    default:
                        if (strict) {
                            throw `Set value of <${input.tagName}> is not supported!`;
                        } else {
                            // 强制读取目标节点的value属性值
                            return input.setAttribute("value", value);
                        }
                }
            }
        }

        function setOption(inputs: DOMEnumerator<IHTMLElement>, value: string) {
            let opt: HTMLInputElement = inputs
                .Select(function (a) {
                    var input = a.asInput;
                    input.checked = false;
                    return input;
                })
                .Where(a => a.value == value)
                .First;

            opt.checked = true;
        }

        function setValues(inputs: DOMEnumerator<IHTMLElement>, value: string, strict: boolean) {
            let first = inputs.First;

            switch (first.tagName.toLowerCase()) {
                case "input":
                    let type = first.asInput.type;

                    switch (type.toLowerCase()) {
                        case "checkbox":
                            setOption(inputs, value);
                            break;

                        case "radio":
                            setOption(inputs, value);
                            break;

                        default:
                            inputs.attr("value", value);
                    }
                    break;

                default:
                    if (strict) {
                        throw `Set value of <${inputs.tagName}> is not supported!`;
                    } else {
                        // 强制读取目标节点的value属性值
                        inputs.attr("value", value);
                    }
            }
        }
    }
}