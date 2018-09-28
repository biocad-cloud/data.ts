module Router {

    var frame: HTMLIFrameElement;

    export function iFrame(): HTMLIFrameElement {
        return frame;
    }

    export function register(appId: string = "app") {
        var a = <Linq.DOM.DOMEnumerator<HTMLAnchorElement>>$ts(".router");
        frame = $ts(`<iframe id="${appId}-frame">`);

        (<HTMLElement>$ts(`#${appId}`)).appendChild(frame);

        a.ForEach(link => link.setAttribute("router-link", link.href));
        a.AddEvent("onclick", (link, click) => {

        });
    }

    export function goto(link: string, stack: Window) {
        if (parent) {
            Router.goto(link, parent);
        } else {
            // 没有parent了，已经到达最顶端了
            var frame: HTMLIFrameElement = (<any>stack).Router.iFrame();
            frame.src = `${link}&refresh=${Math.random()}`;
        }
    }
}