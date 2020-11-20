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
        private categories: {};
        private changes: string[] = [];

        /**
         * create a new argument helper
         * 
         * @param args the ``[key => value]`` pairs
         * @param categories a collection object of ``[category => keys[]]``
        */
        public constructor(args: {} = {}, categories: {} = {}) {
            this.args = $clone(args);
            this.categories = {};

            for (let category in categories) {
                let keys: string[] = categories[category];

                for (let key of keys) {
                    this.categories[key] = category;
                }
            }
        }

        public reset() {
            this.changes = [];
        }

        public setObject(newVals: {}) {
            this.reset();

            for (let name in newVals) {
                this.set(name, newVals[name]);
            }

            return this.getUpdatedCategories(true);
        }

        /**
         * test that argument value is changed or not?
        */
        public assert(key: string, value: any): boolean {
            let oldVal: any = this.args[key];

            if (isNullOrUndefined(value) && isNullOrUndefined(oldVal)) {
                return false;
            }

            if (isNullOrUndefined(value)) {
                return true;
            } else if (isNullOrUndefined(oldVal)) {
                return true;
            } else {
                return value !== oldVal;
            }
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

        public getUpdatedCategories(reset: boolean = true): {} {
            let updates: {} = {};

            if (this.changes.length == 0) {
                return {};
            } else {
                for (let cat of $from(this.changes).Distinct().ToArray()) {
                    updates[cat] = true;
                }
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