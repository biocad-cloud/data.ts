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

 
}