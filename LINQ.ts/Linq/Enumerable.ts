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

    export function Take<T>(source: T[], n: number): Enumerator<T> {
        var takes: T[] = [];

        for (var i = 0; i < n - 1; i++) {
            if (i == source.length) {
                break;
            } else {
                takes.push(source[i]);
            }
        }

        return new Enumerator<T>(takes);
    }

    export function Skip<T>(source: T[], n: number): Enumerator<T> {
        var takes: T[] = [];

        if (n >= source.length) {
            return new Enumerator<T>([]);
        }

        for (var i = n; i < source.length; i++) {
            takes.push(source[i]);
        }

        return new Enumerator<T>(takes);
    }

    export function TakeWhile<T>(source: T[], predicate: (e: T) => boolean): Enumerator<T> {
        return Enumerable.Where(source, predicate);
    }

    export function Where<T>(source: T[], predicate: (e: T) => boolean): Enumerator<T> {
        var takes: T[] = [];

        source.forEach(o => {
            if (predicate(o)) {
                takes.push(o);
            }
        });

        return new Enumerator<T>(takes);
    }

    export function SkipWhile<T>(source: T[], predicate: (e: T) => boolean): Enumerator<T> {
        return Enumerable.Where(source, o => {
            return !predicate(o);
        });
    }

    export function All<T>(source: T[], predicate: (e: T) => boolean): boolean {
        for (var i = 0; i < source.length; i++) {
            if (!predicate(source[i])) {
                return false;
            }
        }

        return true;
    }

    export function Any<T>(source: T[], predicate: (e: T) => boolean): boolean {
        for (var i = 0; i < source.length; i++) {
            if (predicate(source[i])) {
                return true;
            }
        }

        return false;
    }

    export function GroupBy<T, TKey>(source: T[], getKey: (e: T) => TKey, compares: (a: TKey, b: TKey) => number): Group<Tkey, T>[] {
        var tree = new binaryTree<TKey, T[]>(compares);

        source.forEach(obj => {
            var key: TKey = getKey(obj);
            var list: T[] = tree.find(key);

            if (list) {
                list.push(obj);
            } else {
                tree.add(key, [obj]);
            }
        }); 


    }
}