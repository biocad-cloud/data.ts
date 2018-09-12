namespace Which {

    export class DefaultCompares<T> {

        private as_numeric: (x: T) => number = null;

        public compares(a: T, b: T): number {
            if (!this.as_numeric) {
                this.as_numeric = DataExtensions.AsNumeric(a);

                if (!this.as_numeric) {
                    this.as_numeric = DataExtensions.AsNumeric(b);
                }
            }

            if (!this.as_numeric) {
                // a 和 b 都是null或者undefined
                // 认为这两个空值是相等的
                // 则this.as_numeric会在下一个循环之中被赋值
                return 0;
            } else {
                return this.as_numeric(a) - this.as_numeric(b);
            }
        }

        public static default<T>(): (a: T, b: T) => number {
            return new DefaultCompares().compares;
        }
    }

    export function Max<T>(x: IEnumerator<T>, compare: (a: T, b: T) => number = DefaultCompares.default<T>()): number {
        var xMax: T = null;
        var iMax: number = 0;

        for (var i: number = 0; i < x.Count; i++) {
            if (compare(x.ElementAt(i), xMax) > 0) {
                // x > xMax
                xMax = x.ElementAt(i);
                iMax = i;
            }
        }

        return iMax;
    }

    export function Min<T>(x: IEnumerator<T>, compare: (a: T, b: T) => number = DefaultCompares.default<T>()): number {
        return Max<T>(x, (a, b) => - compare(a, b));
    }
}