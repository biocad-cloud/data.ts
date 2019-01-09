// namespace DOM {

// 2018-10-15
// 为了方便书写代码，在其他脚本之中添加变量类型申明，在这里就不进行命名空间的包裹了

/**
 * TypeScript脚本之中的HTML节点元素的类型代理接口
*/
class HTMLTsElement {

    private node: any;

    /**
     * 可以从这里获取得到原生的``HTMLElement``对象用于操作
    */
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
     * 
     * @param html 当这个参数为一个无参数的函数的时候，主要是用于生成一个比较复杂的文档节点而使用的;
     *    如果为字符串文本类型，则是直接将文本当作为HTML代码赋值给当前的这个节点对象的innerHTML属性;
    */
    public display(html: string | HTMLElement | HTMLTsElement | (() => HTMLElement)): HTMLTsElement {
        if (!html) {
            this.HTMLElement.innerHTML = "";
        } else if (typeof html == "string") {
            this.HTMLElement.innerHTML = html;
        } else {
            var node: HTMLElement;
            var parent: HTMLElement = this.HTMLElement;

            if (typeof html == "function") {
                node = html();
            } else {
                node = html instanceof HTMLTsElement ?
                    (<HTMLTsElement>html).HTMLElement :
                    (<HTMLElement>html);
            }

            parent.innerHTML = "";
            parent.appendChild(node);
        }

        return this;
    }

    /**
     * Clear all of the contents in current html element node.
    */
    public clear(): HTMLTsElement {
        this.HTMLElement.innerHTML = "";
        return this;
    }

    public text(innerText: string): HTMLTsElement {
        this.HTMLElement.innerText = innerText;
        return this;
    }

    public addClass(className: string): HTMLTsElement {
        var node = this.HTMLElement

        if (!node.classList.contains(className)) {
            node.classList.add(className);
        }
        return this;
    }

    public removeClass(className: string): HTMLTsElement {
        var node = this.HTMLElement;

        if (node.classList.contains(className)) {
            node.classList.remove(className);
        }
        return this;
    }

    /**
     * 在当前的HTML文档节点之中添加一个新的文档节点
    */
    public append(node: HTMLElement | HTMLTsElement | (() => HTMLElement)): HTMLTsElement {
        if (node instanceof HTMLTsElement) {
            this.HTMLElement.appendChild(node.HTMLElement);
        } else if (node instanceof HTMLElement) {
            this.HTMLElement.appendChild(node);
        } else {
            this.HTMLElement.appendChild(node());
        }

        return this;
    }

    /**
     * 将css的display属性值设置为block用来显示当前的节点
    */
    public show(): HTMLTsElement {
        this.HTMLElement.style.display = "block";
        return this;
    }

    /**
     * 将css的display属性值设置为none来隐藏当前的节点
    */
    public hide(): HTMLTsElement {
        this.HTMLElement.style.display = "none";
        return this;
    }
}

/**
 * 拓展的html文档节点元素对象
*/
interface IHTMLElement extends HTMLElement, HTMLExtensions {
}

interface HTMLExtensions {

    /**
     * 将当前的这个节点元素转换为拓展封装对象类型
    */
    asExtends: HTMLTsElement;

    /**
     * 将当前的html文档节点元素之中的显示内容替换为参数所给定的html内容
    */
    display(html: string | HTMLElement | HTMLTsElement | (() => HTMLElement)): IHTMLElement;
    /**
     * 显示当前的节点元素
    */
    show(): IHTMLElement;
    /**
     * 将当前的节点元素从当前的文档之中隐藏掉
    */
    hide(): IHTMLElement;
    addClass(name: string): IHTMLElement;
    removeClass(name: string): IHTMLElement;

    /**
     * 清除当前的这个html文档节点元素之中的所有内容
    */
    clear(): IHTMLElement;

    /**
     * type casting from this base type
    */
    CType<T extends HTMLElement>(): T;

    asImage: IHTMLImageElement;
    asInput: IHTMLInputElement;
}

/**
 * 带有拓展元素的图像标签对象
*/
interface IHTMLImageElement extends HTMLImageElement, HTMLExtensions {
    
}

/**
 * 带有拓展元素的输入框标签对象
*/
interface IHTMLInputElement extends HTMLInputElement, HTMLExtensions {

}