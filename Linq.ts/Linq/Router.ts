/**
 * 路由器模块
*/
module Router {

    var frames: Dictionary<HTMLIFrameElement>;

    export function iFrame(app: string): HTMLIFrameElement {
        return frames.Item(app);
    }

    const routerLink: string = "router-link";

    /**
     * 父容器页面注册视图容器对象
    */
    export function register(appId: string = "app", frameRegister: boolean = true) {
        var aLink: Linq.DOM.DOMEnumerator<HTMLAnchorElement>;

        aLink = $ts(".router");
        aLink.attr("router-link", link => link.href);
        aLink.attr("href", "javascript:void(0);");
        aLink.onClick((link, click) => {
            Router.goto(link.getAttribute("router-link"), appId);
        });

        if (frameRegister && (!frames || !frames.ContainsKey(appId))) {
            registerFrame(appId);
        }
    }

    /**
     * 在当前的栈空间环境之中注册视图层环境
    */
    function registerFrame(appId: string) {
        var frame: HTMLIFrameElement = $ts(`<iframe id="${appId}-frame">`, {
            frameborder: "no",
            border: 0,
            marginwidth: 0,
            marginheight: 0,
            scrolling: "no",
            allowtransparency: "yes"
        });

        (<HTMLElement>$ts(`#${appId}`)).appendChild(frame);

        if (!frames) {
            frames = new Dictionary<HTMLIFrameElement>({});
        }
        frames.Add(appId, frame);
    }

    function navigate(link: string, stack: Window, appId: string) {
        var frame: HTMLIFrameElement = (<any>stack).Router.iFrame(appId);

        frame.src = link;
        frame.onload = function () {
            var win = (<any>frame.contentWindow);
            var router = win.Router;

            router.register(appId, false);
        }
        window.location.hash = new TsLinq.URL(link).fileName;
    }

    /**
     * 当前的堆栈环境是否是最顶层的堆栈？
    */
    export function IsTopWindowStack(): boolean {
        return parent && (parent.location.pathname == window.location.pathname);
    }

    /**
     * 因为link之中可能存在查询参数，所以必须要在web服务器上面测试
    */
    export function goto(link: string, appId: string, stack: Window = null) {
        if (!Router.IsTopWindowStack()) {
            (<any>parent).Router.goto(link, appId, parent);
        } else if (stack) {
            // 没有parent了，已经到达最顶端了
            navigate(link, stack, appId);
        } else {
            navigate(link, window, appId);
        }
    }
}