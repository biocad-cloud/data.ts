namespace Internal {

    export class BackgroundWorker {

        public static $workers = {};

        public static get hasWorkerFeature(): boolean {
            if (typeof (Worker) !== "undefined") {
                return true;
            } else {
                return false;
            }
        }

        public static RunWorker(script: string, onMessage: Delegate.Sub) {
            let url: string;

            if (!TypeScript.URLPatterns.isFromSameOrigin(script)) {
                url = this.fetchWorker(script);
            } else {
                url = script;
            }

            BackgroundWorker.$workers[script] = new Worker(url);
            BackgroundWorker.$workers[script].onmessage = onMessage;
        }

        /**
         * How to create a Web Worker from a string
         * 
         * > https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string/10372280#10372280
        */
        private static fetchWorker(scriptUrl: string): string {
            // get script text from server
            let script: string = HttpHelpers.GET(scriptUrl);
            let blob: Blob;

            try {
                blob = new Blob([script], { type: 'application/javascript' });
            } catch (e) {
                // Backwards-compatibility
                let webEngine: any = window;

                webEngine.BlobBuilder = webEngine.BlobBuilder ||
                    webEngine.WebKitBlobBuilder ||
                    webEngine.MozBlobBuilder;

                blob = webEngine.BlobBuilder();

                (<any>blob).append(script);
                blob = (<any>blob).getBlob();
            }

            return URL.createObjectURL(blob);
        }

        public static Stop(script: string) {
            BackgroundWorker.$workers[script].terminate();

            // removes worker object
            delete BackgroundWorker.$workers[script];
        }
    }
}