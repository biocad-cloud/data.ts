namespace TsLinq {

    export class MetaReader {

        private readonly meta: object;

        public constructor(meta: object) {
            this.meta = meta;
        }

        /**
         * Read meta object value by call name
         * 
         * > https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
        */
        public GetValue(key: string = null): any {
            if (!key) {
                key = arguments.callee.caller.toString();
            }

            if (key in this.meta) {
                return this.meta[key];
            } else {
                return null;
            }
        }
    }
}