
/**
 * 实现这个类需要重写下面的方法实现：
 * 
 * + ``protected abstract init(): void;``
 * 
 * 可以选择性的重写下面的事件处理器
 * 
 * + ``protected OnDocumentReady(): void``
 * + ``protected OnWindowLoad(): void``
 * + ``protected OnHashChanged(hash: string): void``
 * 
 * 也可以重写下面的事件来获取当前的app的名称
 * 
 * + ``protected getCurrentAppPage(): string``
*/
abstract class Bootstrap {

    protected appName: string;
    protected status: string;

    public constructor(app: string, caseSensitive: boolean = false) {
        this.status = "Sleep";

        if (caseSensitive) {
            if (this.getCurrentAppPage() == app) {
                this.Init();
            }
        } else {
            if (this.getCurrentAppPage().toLowerCase() == app.toLowerCase()) {
                this.Init();
            }
        }
    }

    private Init(): void {
        var vm = this;

        // attach event handlers
        $ts(() => this.OnDocumentReady());

        window.onload = this.OnWindowLoad;
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

    /**
     * Event handler on url hash link changed
    */
    protected OnHashChanged(hash: string): void {
        // do nothing
    }

    protected getCurrentAppPage(): string {
        return getAllUrlParams().Item("app");
    }

    public toString(): string {
        return `[${this.status}] ${this.appName}`;
    }
}