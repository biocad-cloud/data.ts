/// <reference path="Enumerator.ts" />

/**
 * The linq pipline implements at here. 
*/
module Enumerable {

    /**
     * 进行数据序列的投影操作
     * 
    */
    export function Select<T, TOut>(source: T[], project: (e: T) => TOut): IEnumerator<TOut> {
        var projections: TOut[] = [];

        source.forEach(o => {
            projections.push(project(o));
        });

        return new IEnumerator<TOut>(projections);
    }

    /**
     * 进行数据序列的排序操作
     * 
    */
    export function OrderBy<T>(source: T[], key: (e: T) => number): IEnumerator<T> {
        // array clone
        var clone: T[] = [...source];

        clone.sort((a, b) => {
            // a - b
            return key(a) - key(b);
        });
        console.log("clone");
        console.log(clone);
        return new IEnumerator<T>(clone);
    }

    export function OrderByDescending<T>(source: T[], key: (e: T) => number): IEnumerator<T> {
        return Enumerable.OrderBy(source, (e) => {
            // b - a
            return -key(e);
        });
    }

    export function Take<T>(source: T[], n: number): IEnumerator<T> {
        var takes: T[] = [];

        for (var i = 0; i < n - 1; i++) {
            if (i == source.length) {
                break;
            } else {
                takes.push(source[i]);
            }
        }

        return new IEnumerator<T>(takes);
    }

    export function Skip<T>(source: T[], n: number): IEnumerator<T> {
        var takes: T[] = [];

        if (n >= source.length) {
            return new IEnumerator<T>([]);
        }

        for (var i = n; i < source.length; i++) {
            takes.push(source[i]);
        }

        return new IEnumerator<T>(takes);
    }

    export function TakeWhile<T>(source: T[], predicate: (e: T) => boolean): IEnumerator<T> {
        return Enumerable.Where(source, predicate);
    }

    export function Where<T>(source: T[], predicate: (e: T) => boolean): IEnumerator<T> {
        var takes: T[] = [];

        source.forEach(o => {
            if (predicate(o)) {
                takes.push(o);
            }
        });

        return new IEnumerator<T>(takes);
    }

    export function SkipWhile<T>(source: T[], predicate: (e: T) => boolean): IEnumerator<T> {
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

    /**
     * Implements a ``group by`` operation by binary tree data structure.
    */
    export function GroupBy<T, TKey>(source: T[],
        getKey: (e: T) => TKey,
        compares: (a: TKey, b: TKey) => number): IEnumerator<Group<TKey, T>> {

        var tree = new algorithmBTree.binaryTree<TKey, T[]>(compares);

        source.forEach(obj => {
            var key: TKey = getKey(obj);
            var list: T[] = tree.find(key);

            if (list) {
                list.push(obj);
            } else {
                tree.add(key, [obj]);
            }
        });

        console.log(tree);

        return tree.AsEnumerable().Select(node => {
            return new Group<TKey, T>(node.key, node.value);
        });
    }
}