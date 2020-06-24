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
                    let method: Delegate.Action = app[methodName];

                    $ts(`#${methodName}`).onclick = method;

                    console.info(`%c[${type.class}] hook onclick for #${methodName}...`, "color:green;");
                }
            }
        }
    }
}