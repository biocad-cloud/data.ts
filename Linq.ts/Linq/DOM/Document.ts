namespace Linq.DOM {

    export function query(expr: string): IEnumerator<HTMLElement> {
        var type: string = expr.charAt(0);
        var nodes: any;

        if (type == ".") {
            nodes = document.getElementsByClassName(expr.substr(1));
        } else if (type == "#") {
            nodes = [document.getElementById(expr.substr(1))];
        } else {
            nodes = document.getElementsByTagName(expr);
        }

        var list: HTMLElement[] = [];
        var len: number = nodes.length;

        for (var i: number = 0; i < len; i++) {
            list.push(nodes[i]);
        }

        return new IEnumerator<HTMLElement>(list);
    }

    /**
     *
    */
    export function addEvent(el: any, type: string, fn: (event) => void): void {
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