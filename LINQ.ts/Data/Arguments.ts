namespace TypeScript.Data {

    /**
     * an argument update helper
    */
    export class Arguments {

        /**
         * ``[key => value]`` pairs
        */
        private args: {} = {};
        /**
         * ``[key => category]`` pairs
        */
        private categories: {} = {};
        private changes: string[] = [];

        public constructor(args: {} = {}, categories: {} = {}) {
            this.args = $clone(args);
            this.categories = $clone(categories);
        }

        /**
         * set argument category group.
         * 
         * @param key the argument name.
         * @param group the argument category group.
         * 
        */
        public category(key: string, group: string = null): string {
            if (Strings.Empty(group)) {
                if (key in this.categories) {
                    return this.categories[key];
                } else {
                    return null;
                }
            } else {
                this.categories[key] = group;
            }

            return group;
        }

        public set(key: string, value: any) {
            this.args[key] = value;

            if (key in this.categories) {
                this.changes.push(this.categories[key]);
            }
        }

        public get(key: string) {
            if (key in this.args) {
                return this.args[key];
            } else {
                return null;
            }
        }

        public getUpdates(reset: boolean = true): {} {
            let updates: {} = {};

            for (let cat of $from(this.changes).Distinct().ToArray()) {
                updates[cat] = true;
            }

            if (reset) {
                this.changes = [];
            }

            return updates;
        }

        /**
         * to url query parameters
        */
        public toString(): string {
            return HttpHelpers.serialize(this.args);
        }
    }
}