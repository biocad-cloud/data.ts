namespace Internal.EventHandles {

    /**
     * find all elements' id on current html page
    */
    export function findAllElement(attr: "id" | "name" = "id"): string[] {
        let elements = document.querySelectorAll(`*[${attr}]`);
        let id: string[] = [];

        for (let node of $ts(elements).ToArray(false)) {
            id.push(node.id);
        }

        return id;
    }

    /**
     * handle on clicks
    */
    function hookOnClicks(app: {}, elements: string[], type: TypeScript.Reflection.TypeInfo) {
        for (let publicMethodName of type.methods) {
            if (Strings.Empty(publicMethodName, false)) {
                continue;
            }

            const name_noclick: string = publicMethodName
                .replace("_click", "")
                .replace("_onclick", "");

            if (!tryHookClickEvent(app, elements, publicMethodName, type.class)) {
                tryHookClickEvent(app, elements, name_noclick, type.class)
            }
        }
    }

    function tryHookClickEvent(app: {}, elements: string[], publicMethodName: string, typeName: string): boolean {
        if (elements.indexOf(publicMethodName) > -1) {
            let arguments = parseFunctionArgumentNames(app[publicMethodName]);

            if (arguments.length == 0 || arguments.length == 2) {
                $ts(`#${publicMethodName}`).onclick = <any>function (handler, evt): any {
                    return app[publicMethodName](handler, evt);
                }

                TypeScript.logging.log(`[${typeName}] hook onclick for #${publicMethodName}...`, TypeScript.ConsoleColors.Green);

                return true;
            }
        }

        return false;
    }

    const onchangeToken: string = "_onchange";

    // <input id="email" />
    // email_onchange(value: string) {
    //     ...
    // }

    function hookOnChange(app: {}, elements: string[], type: TypeScript.Reflection.TypeInfo) {
        elements = $from(elements).Select(id => `${id}${onchangeToken}`).ToArray();

        for (let publicMethodName of type.methods) {
            if (elements.indexOf(publicMethodName) == -1) {
                continue;
            }

            let onchange = app[publicMethodName];
            let arguments = parseFunctionArgumentNames(onchange);
            let id: string = publicMethodName.replace(onchangeToken, "");
            let a = document.getElementById(id);
            let tag = a.tagName.toLowerCase();

            if (arguments.length == 1 && arguments[0] == "value") {
                if (tag == "input" || tag == "textarea") {
                    let type = a.getAttribute("type");

                    if (!isNullOrUndefined(type) && type.toLowerCase() == "file") {
                        a.onchange = function () {
                            let value = $input(a).files;
                            return app[publicMethodName](value);
                        }
                    } else {
                        a.onchange = function () {
                            let value = DOM.InputValueGetter.unifyGetValue(a);
                            return app[publicMethodName](value);
                        }
                    }
                } else if (tag == "select") {
                    a.onchange = function () {
                        let value = DOM.InputValueGetter.unifyGetValue(a);
                        return app[publicMethodName](value);
                    }
                } else {
                    TypeScript.logging.log(`invalid tag name: ${a.tagName}!`, "red");
                }
            } else if (arguments.length == 0) {
                $input(a).onchange = function () {
                    return app[publicMethodName]();
                }
            }
        }
    }

    export function hookEventHandles(app: {}) {
        let elements: string[] = findAllElement("id");
        let type = TypeScript.Reflection.$typeof(app);

        // handle on clicks
        hookOnClicks(app, elements, type);
        hookOnChange(app, elements, type);
    }

    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    export function parseFunctionArgumentNames(func: any): string[] {
        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if (result === null) {
            return [];
        } else {
            return result;
        }
    }
}