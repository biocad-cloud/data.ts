namespace Which {

    export class DefaultCompares<T> {

        public compares(a: T, b: T): number {

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