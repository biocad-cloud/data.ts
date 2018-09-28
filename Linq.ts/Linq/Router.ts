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
        aLinks.attr("href", "javascript:void(0)");
        aLinks.AddEvent("onclick", (link, click) => {
            Router.goto(link.getAttribute("router-link"));
        });
    }

    export function goto(link: string, stack: Window = null) {
        if (parent) {
            Router.goto(link, parent);
        } else {
            // 没有parent了，已经到达最顶端了
            var frame: HTMLIFrameElement;
            frame = (<any>stack).Router.iFrame();
            frame.src = `${link}&refresh=${Math.random()}`;
        }
    }
}