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
        let elements: {} = $from(findAllElementId()).ToDictionary(id => id).Object;
        let type = TypeScript.Reflection.$typeof(app);

        for (let methodName of type.methods) {
            if (methodName in elements) {
                let method: Delegate.Action = app[methodName];

                $ts(`#${methodName}`).onclick = method;
            }
        }
    }
}