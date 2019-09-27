namespace Internal {

    export class BackgroundWorker {

        public static $workers = {};

        public get hasWorkerFeature(): boolean {
            if (typeof (Worker) !== "undefined") {
                return true;
            } else {
                return false;
            }
        }

        public static RunWorker(script: string, onMessage: Delegate.Sub) {
            BackgroundWorker.$workers[script] = new Worker(script);
            BackgroundWorker.$workers[script].onmessage = onMessage;
        }

        public static Stop(script: string) {
            BackgroundWorker.$workers[script].terminate();
            // removes worker object
            delete BackgroundWorker.$workers[script];
        }
    }
}