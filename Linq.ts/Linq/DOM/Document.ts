namespace Linq.DOM {

    /**
     * 
    */
    export function AddSelectOptions(items: Map<string, string>[], div: string) {
 
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