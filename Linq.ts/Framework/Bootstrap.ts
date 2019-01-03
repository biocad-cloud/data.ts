
/**
 * 实现这个类需要重写下面的方法实现：
 * 
 * + ``protected abstract init(): void;``
 * + ``public abstract get appName(): string``
 * 
 * 可以选择性的重写下面的事件处理器
 * 
 * + ``protected OnDocumentReady(): void``
 * + ``protected OnWindowLoad(): void``
 * + ``protected OnWindowUnload(): string``
 * + ``protected OnHashChanged(hash: string): void``
 * 
 * 也可以重写下面的事件来获取当前的app的名称
 * 
 * + ``protected getCurrentAppPage(): string``
*/
abstract class Bootstrap {

    protected status: string;
    /**
     * 是否阻止用户关闭当前页面
    */
    protected hookUnload: string;

    public abstract get appName(): string;

    public get appStatus(): string {
        return this.status;
    }

    public get appHookMsg(): string {
        return this.hookUnload;
    }

    public constructor() {
        this.status = "Sleep";
        this.hookUnload = null;
    }

    public Init(): void {
        var vm = this;
        var currentAppName: string = this.getCurrentAppPage();

        // 必须要当前的App名称和当前的页面app一致的时候这个App的运行才会被触发
        if (currentAppName != this.appName) {
            if ($ts.FrameworkDebug) {
                console.log(`[${TypeInfo.typeof(this).class}] Continue Sleep as: TRUE = ${currentAppName} <> ${this.appName}`);
            }
            return;
        } else if ($ts.FrameworkDebug) {
            console.log(`[${TypeInfo.typeof(this).class}] App(name:=${this.appName}) Init...`);
        }

        // attach event handlers
        $ts(() => this.OnDocumentReady());

        window.onload = this.OnWindowLoad;
        window.onbeforeunload = this.OnWindowUnload;
        window.onhashchange = function () {
            var hash = window.location.hash;
            var val = hash.substr(1);

            vm.OnHashChanged(val);
        };

        this.init();
        this.status = "Running";
    }

    /**
     * 初始化代码
    */
    protected abstract init(): void;

    /**
     * Event handler on document is ready
    */
    protected OnDocumentReady(): void {
        // do nothing
    }
    /**
     * Event handler on Window loaded
    */
    protected OnWindowLoad(): void {
        // do nothing
    }

    protected OnWindowUnload(): string {
        if (!Strings.Empty(this.hookUnload, true)) {
            return this.hookUnload;
        } else {
            return null;
        }
    }

    public unhook() {
        this.hookUnload = null;
    }

    /**
     * Event handler on url hash link changed
    */
    protected OnHashChanged(hash: string): void {
        // do nothing
    }

    /**
     * 这个函数默认是取出url query之中的app参数字符串作为应用名称
     * 
     * @returns 如果没有定义app参数，则默认是返回``/``作为名称
    */
    protected getCurrentAppPage(): string {
        return getAllUrlParams().Item("app") || "/";
    }

    public toString(): string {
        return `[${this.status}] ${this.appName}`;
    }
}