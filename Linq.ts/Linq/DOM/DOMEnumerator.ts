namespace Linq.DOM {

    // /**
    //  * Creates an instance of the element for the specified tag.
    //  * @param tagName The name of an element.
    // */
    // createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options ?: ElementCreationOptions): HTMLElementTagNameMap[K];

    export class DOMEnumerator<T extends HTMLElement> extends IEnumerator<T> {

        public constructor(elements: T[] | IEnumerator<T>) {
            super(elements);
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
                        element.nodeValue = value.Item(i);
                    });
                }
            }

            return this.Select(element => element.nodeValue);
        }
    }
}