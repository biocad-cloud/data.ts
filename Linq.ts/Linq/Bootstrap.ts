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