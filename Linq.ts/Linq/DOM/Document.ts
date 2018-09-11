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
        selectName: string) {

        var options = From(items)
            .Select(item => `<option value="${item.value}">${item.key}</option>`)
            .JoinBy("\n");
        var html: string = `
            <select class="multipleSelect" multiple name="${selectName}">
                ${options}
            </select>`;

        (<HTMLElement>$ts(`#${div}`)).innerHTML = html;
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
     *
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