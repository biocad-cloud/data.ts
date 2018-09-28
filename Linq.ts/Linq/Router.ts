module Router {

    var frame: HTMLIFrameElement;

    export function iFrame(): HTMLIFrameElement {
        return frame;
    }

    const routerLink: string = "router-link";

    export function register(appId: string = "app") {
        var aLinks: Linq.DOM.DOMEnumerator<HTMLAnchorElement>;

        frame = $ts(`<iframe id="${appId}-frame">`);
        aLinks = $ts(".router");

        (<HTMLElement>$ts(`#${appId}`)).appendChild(frame);

        aLinks.attr("router-link", link => link.href);
        aLinks.attr("href", "#");
        aLinks.onClick((link, click) => {
            Router.goto(link.getAttribute("router-link"));
        });
    }

    /**
     * 因为link之中可能存在查询参数，所以必须要在web服务器上面测试
    */
    export function goto(link: string, stack: Window = null) {
        if (parent && parent != window) {
            Router.goto(link, parent);
        } else if (stack) {
            // 没有parent了，已经到达最顶端了
            var frame: HTMLIFrameElement;
            frame = (<any>stack).Router.iFrame();
            frame.src = `${link}&refresh=${Math.random()}`;
        } else {
            Router.iFrame().src = `${link}&refresh=${Math.random()}`;
        }
    }
}