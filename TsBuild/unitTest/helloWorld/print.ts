namespace demo.app.pages {

    export class printTest extends Bootstrap {

        public get appName(): string {
            return "index"
        };

        protected init(): void {
            console.log('Hello world');
        }
    }
}