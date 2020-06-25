namespace Internal {

    export module EventHandles {

        /**
         * find all elements' id on current html page
        */
        export function findAllElementId(): string[] {
            let elements = document.querySelectorAll('*[id]');
            let id: string[] = [];

            for (let node of $ts(elements).ToArray(false)) {
                id.push(node.id);
            }

            return id;
        }

        export function hookEventHandles(app: {}) {
            let elements: string[] = findAllElementId();
            let type = TypeScript.Reflection.$typeof(app);

            for (let methodName of type.methods) {
                if (elements.indexOf(methodName) > -1) {
                    $ts(`#${methodName}`).onclick = <any>function (handler, evt): any {
                        return app[methodName](handler, evt);
                    }

                    console.info(`%c[${type.class}] hook onclick for #${methodName}...`, "color:green;");
                }
            }
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
}