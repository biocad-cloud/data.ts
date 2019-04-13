namespace WebAssembly {

    export module Document {

        export function getElementById(id: number): number {
            let idText: string = ObjectManager.readText(id);
            let node = window.document.getElementById(idText);

            return ObjectManager.addObject(node);
        }

        export function writeElementText(key: number, text: number) {
            let node: HTMLElement = ObjectManager.getObject(key);
            let textVal: string = ObjectManager.readText(text);

            node.innerText = textVal;
        }
    }
}