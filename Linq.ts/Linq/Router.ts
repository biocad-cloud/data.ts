/**
 * 路由器模块
*/
module Router {

    var frames: Dictionary<HTMLIFrameElement> = new Dictionary<HTMLIFrameElement>({});

    export function iFrame(app: string): HTMLIFrameElement {
        return frames.Item(app);
    }

    const routerLink: string = "router-link";

    /**
     * 父容器页面注释视图容器对象
    */
    export function register(appId: string = "app") {
        var aLink: Linq.DOM.DOMEnumerator<HTMLAnchorElement>;
        var frame: HTMLIFrameElement;

        aLink = $ts(".router");
        frame = $ts(`<iframe id="${appId}-frame">`, {
            frameborder: "no",
            border: 0,
            marginwidth: 0,
            marginheight: 0,
            scrolling: "no",
            allowtransparency: "yes"
        });

        (<HTMLElement>$ts(`#${appId}`)).appendChild(frame);

        aLink.attr("router-link", link => link.href);
        aLink.attr("href", "javascript:void(0);");
        aLink.onClick((link, click) => {
            Router.goto(link.getAttribute("router-link"), appId);
        });

        frames.Add(appId, frame);
    }

    /**
     * 因为link之中可能存在查询参数，所以必须要在web服务器上面测试
    */
    export function goto(link: string, appId: string, stack: Window = null) {
        if (parent && parent != window) {
            Router.goto(link, appId, parent);
        } else if (stack) {
            // 没有parent了，已经到达最顶端了
            var frame: HTMLIFrameElement;
            frame = (<any>stack).Router.iFrame(appId);
            frame.src = link;
        } else {
            Router.iFrame(appId).src = link;
        }
    }
}