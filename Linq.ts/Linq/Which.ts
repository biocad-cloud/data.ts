module Which {

    export function Max<T>(
        x: IEnumerator<T>,
        compare: (a: T, b: T) => number = (a, b) => {
            return DataExtensions.as_numeric(a) - DataExtensions.as_numeric(b);
        }): number {

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
}