/**
 * HTML文档操作帮助函数
*/
namespace Linq.DOM {

    /**
     * 向指定id编号的div添加select标签的组件
    */
    export function AddSelectOptions(
        items: Map<string, string>[],
        div: string,
        selectName: string,
        className: string = "") {

        var options = From(items)
            .Select(item => `<option value="${item.value}">${item.key}</option>`)
            .JoinBy("\n");
        var html: string = `
            <select class="${className}" multiple name="${selectName}">
                ${options}
            </select>`;

        (<HTMLElement>$ts(`#${div}`)).innerHTML = html;
    }

    export function AddHTMLTable(rows: object[], headers: string[] | IEnumerator<string> | IEnumerator<Map<string, string>> | Map<string, string>[], div: string) {

    }

    /**
     * Execute a given function when the document is ready.
     * 
     * @param fn A function that without any parameters
    */
    export function ready(fn: () => void) {
        if (typeof fn !== 'function') {
            // Sanity check
            return;
        }

        if (document.readyState === 'complete') {
            // If document is already loaded, run method
            return fn();
        } else {
            // Otherwise, wait until document is loaded
            document.addEventListener('DOMContentLoaded', fn, false);
        }
    }

    /**
     * 向一个给定的HTML元素或者HTML元素的集合之中的对象添加给定的事件
     * 
     * @param el HTML节点元素或者节点元素的集合
     * @param type 事件的名称字符串
     * @param fn 对事件名称所指定的事件进行处理的工作函数，这个工作函数应该具备有一个事件对象作为函数参数
    */
    export function addEvent(el: any, type: string, fn: (event: Event) => void): void {
        if (document.addEventListener) {
            if (el && (el.nodeName) || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        } else {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, () => {
                    return fn.call(el, window.event);
                });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        }
    }
}