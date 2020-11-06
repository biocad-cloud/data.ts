namespace TypeScript.Data {

    export class Arguments {

        /**
         * ``[key => value]`` pairs
        */
        private args: {} = {};
        /**
         * ``[key => category]`` pairs
        */
        private categories: {} = {};

        public constructor(args: {} = {}) {
            this.args = $clone(args);
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
    }
}