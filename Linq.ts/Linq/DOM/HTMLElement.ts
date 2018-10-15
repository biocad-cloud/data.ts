// namespace Linq.DOM {

// 2018-10-15
// 为了方便书写代码，在其他脚本之中添加变量类型申明，在这里就不进行命名空间的包裹了

class HTMLTsElement {

    private node: any;

    public get HTMLElement(): HTMLElement {
        return <HTMLElement>this.node;
    }

    public constructor(node: HTMLElement | HTMLTsElement) {
        this.node = node instanceof HTMLElement ?
            (<HTMLElement>node) :
            (<HTMLTsElement>node).node;
    }

    /**
     * 这个拓展函数总是会将节点中的原来的内容清空，然后显示html函数参数
     * 所给定的内容
    */
    public display(html: string | HTMLElement | HTMLTsElement): HTMLTsElement {
        if (!html) {
            this.HTMLElement.innerHTML = "";
        } else if (typeof html == "string") {
            this.HTMLElement.innerHTML = html;
        } else {
            var node: HTMLElement = html instanceof HTMLTsElement ?
                (<HTMLTsElement>html).HTMLElement :
                (<HTMLElement>html);
            var parent: HTMLElement = this.HTMLElement;

            parent.innerHTML = "";
            parent.appendChild(node);
        }

        return this;
    }

    public addClass(className: string): HTMLTsElement {
        var node = this.HTMLElement

        if (!node.classList.contains(className)) {
            node.classList.add(className);
        }
        return this;
    }

    public removeClass(className: string) {
        var node = this.HTMLElement;

        if (node.classList.contains(className)) {
            node.classList.remove(className);
        }
        return this;
    }
}