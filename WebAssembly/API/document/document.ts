namespace WebAssembly {

    export module Document {

        export function getElementById(id: number): number {
            let idText: string = ObjectManager.readText(id);
            let node = document.getElementById(idText);

            return ObjectManager.addObject(node);
        }

        export function writeElementText(nodeObj: number, text: number) {
            let node: HTMLElement = ObjectManager.getObject(nodeObj);
            let textVal: string = ObjectManager.readText(text);

            node.innerText = textVal;
        }

        export function writeElementHtml(node: number, text: number) {
            let nodeObj: HTMLElement = ObjectManager.getObject(node);
            let htmlVal: string = ObjectManager.readText(text);

            nodeObj.innerHTML = htmlVal;
        }

        export function createElement(tag: number): number {
            let tagName: string = ObjectManager.readText(tag);
            let node = document.createElement(tagName);

            return ObjectManager.addObject(node);
        };

        export function setAttribute(node: number, attr: number, value: number) {
            let nodeObj: HTMLElement = ObjectManager.getObject(node);
            let name: string = ObjectManager.readText(attr);
            let attrVal: string = ObjectManager.readText(value);

            nodeObj.setAttribute(name, attrVal);
        }

        export function appendChild(parent: number, node: number) {
            let parentObj: HTMLElement = ObjectManager.getObject(parent);
            let child: HTMLElement = ObjectManager.getObject(node);

            parentObj.appendChild(child);
        }
    }
}