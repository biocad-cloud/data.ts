module Enumerable {

    export function Select<T, TOut>(source: T[], project: (e: T) => TOut): Enumerator<TOut> {
        var projections: TOut[] = [];

        source.forEach(o => {
            projections.push(project(o));
        });

        return new Enumerator<TOut>(projections);
    }

    export function OrderBy<T>(source: T[], key: (e: T) => number): Enumerator<T> {
        // array clone
        var clone: T[] = [...source];

        clone.sort((a, b) => {
            // a - b
            return key(a) - key(b);
        });

        return new Enumerator<T>(clone);
    }

    export function OrderByDescending<T>(source: T[], key: (e: T) => number): Enumerator<T> {
        return Enumerable.OrderBy(source, (e) => {
            // b - a
            return -key(e);
        });
    }
}