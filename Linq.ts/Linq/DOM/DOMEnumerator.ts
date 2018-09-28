namespace Linq.DOM {

    // /**
    //  * Creates an instance of the element for the specified tag.
    //  * @param tagName The name of an element.
    // */
    // createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options ?: ElementCreationOptions): HTMLElementTagNameMap[K];

    export class DOMEnumerator<T extends HTMLElement> extends IEnumerator<T> {

        public constructor(elements: T[] | IEnumerator<T> | NodeListOf<T>) {
            super(DOMEnumerator.ensureElements(elements));
        }

        private static ensureElements<T extends HTMLElement>(elements: T[] | IEnumerator<T> | NodeListOf<T>): T[] {
            var type = TypeInfo.typeof(elements);

            if (type.typeOf == "array") {
                return <T[]>elements;
            } else if (type.IsEnumerator) {
                return (<IEnumerator<T>>elements).ToArray();
            } else {
                var list: T[] = [];

                (<NodeListOf<T>>elements).forEach(x => list.push(x));
                return list;
            }
        }

        /**
         * @param value 如果需要批量清除节点之中的值的话，需要传递一个空字符串，而非空值
        */
        public val(value: string | string[] | IEnumerator<string> = null): IEnumerator<string> {
            if (!(value == null && value == undefined)) {
                if (typeof value == "string") {
                    // 所有元素都设置同一个值
                    this.ForEach(element => {
                        element.nodeValue = value;
                    });
                } else if (Array.isArray(value)) {
                    this.ForEach((element, i) => {
                        element.nodeValue = value[i];
                    });
                } else {
                    this.ForEach((element, i) => {
                        element.nodeValue = value.ElementAt(i);
                    });
                }
            }

            return this.Select(element => element.nodeValue);
        }

        public attr(attrName: string, val: string | IEnumerator<string> | string[] | ((x: T) => string) = null): IEnumerator<string> {
            if (val) {
                if (typeof val == "function") {
                    return this.Select(x => {
                        var value: string = val(x);
                        x.setAttribute(attrName, value);
                        return value;
                    });
                } else {
                    var array: string[] = Linq.EnsureArray(val, this.Count);
                }
            } else {
                return this.Select(x => x.getAttribute(attrName));
            }
        }

        public AddClass(className: string): DOMEnumerator<T> {
            this.ForEach(x => {
                if (!x.classList.contains(className)) {
                    x.classList.add(className);
                }
            })
            return this;
        }

        public AddEvent(eventName: string, handler: (sender: T, event: Event) => void) {
            this.ForEach(element => {
                var event = function (Event: Event) {
                    handler(element, Event);
                }
                Linq.DOM.addEvent(element, eventName, event);
            })
        }

        public onChange(handler: (sender: T, event: Event) => void) {
            this.AddEvent("onchange", handler);
        }

        public RemoveClass(className: string): DOMEnumerator<T> {
            this.ForEach(x => {
                if (x.classList.contains(className)) {
                    x.classList.remove(className);
                }
            })
            return this;
        }

        public hide(): DOMEnumerator<T> {
            this.ForEach(x => x.style.display = "none");
            return this;
        }

        public show(): DOMEnumerator<T> {
            this.ForEach(x => x.style.display = "block");
            return this;
        }

        /**
         * 将所选定的节点批量删除
        */
        public Delete() {
            this.ForEach(x => x.parentNode.removeChild(x));
        }
    }
}