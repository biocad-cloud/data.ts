﻿/**
 * Provides a set of static (Shared in Visual Basic) methods for querying 
 * objects that implement ``System.Collections.Generic.IEnumerable<T>``.
*/
class IEnumerator<T> implements IEnumerable<T> {

    readonly [index: number]: T;

    /**
     * The number of elements in the data sequence.
    */
    readonly Count: number;

    /**
     * The data sequence with specific type.
    */
    protected sequence: T[];

    constructor(source: T[]) {
        this.sequence = source;
        this.Count = source.length;
    }

    public First(): T {
        return this.sequence[0];
    }

    public Last(): T {
        return this.sequence[this.Count - 1];
    }

    /**
     * Projects each element of a sequence into a new form.
     * 
     * @typedef TOut The type of the value returned by selector.
     * 
     * @param selector A transform function to apply to each element.
     * 
     * @returns An ``System.Collections.Generic.IEnumerable<T>`` 
     *          whose elements are the result of invoking the 
     *          transform function on each element of source.
    */
    public Select<TOut>(selector: (o: T) => TOut): IEnumerator<TOut> {
        return Enumerable.Select<T, TOut>(this.sequence, selector);
    }

    /**
     * Groups the elements of a sequence according to a key selector function. 
     * The keys are compared by using a comparer and each group's elements 
     * are projected by using a specified function.
    */
    public GroupBy<TKey>(keySelector: (o: T) => TKey, compares: (a: TKey, b: TKey) => number): IEnumerator<Group<TKey, T>> {
        return Enumerable.GroupBy(this.sequence, keySelector, compares);
    }

    /**
     * Filters a sequence of values based on a predicate.
    */
    public Where(predicate: (e: T) => boolean): IEnumerator<T> {
        return Enumerable.Where(this.sequence, predicate);
    }

    public Min(project: (e: T) => number = null): T {
        if (!project) project = (e) => {
            return Number(e);
        }
        return Enumerable.OrderBy(this.sequence, project)[0];
    }

    public Max(project: (e: T) => number = null): T {
        if (!project) project = (e) => {
            return Number(e);
        }
        return Enumerable.OrderByDescending(this.sequence, project)[0];
    }

    public Average(project: (e: T) => number = null): number {
        if (this.Count == 0) {
            return 0;
        } else {
            return this.Sum(project) / this.sequence.length;
        }
    }

    public Sum(project: (e: T) => number = null): number {
        var x: number = 0;

        if (!project) project = (e) => {
            return Number(e);
        }

        for (var i = 0; i < this.sequence.length; i++) {
            x += project(this.sequence[i]);
        }

        return x;
    }

    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     * 
     * @param key A function to extract a key from an element.
     *
     * @returns An ``System.Linq.IOrderedEnumerable<T>`` whose elements are 
     *          sorted according to a key.
    */
    public OrderBy(key: (e: T) => number): IEnumerator<T> {
        return Enumerable.OrderBy(this.sequence, key);
    }

    /**
     * Sorts the elements of a sequence in descending order according to a key.
     * 
     * @param key A function to extract a key from an element.
     * 
     * @returns An ``System.Linq.IOrderedEnumerable<T>`` whose elements are 
     *          sorted in descending order according to a key.
    */
    public OrderByOrderByDescending(key: (e: T) => number): IEnumerator<T> {
        return Enumerable.OrderByDescending(this.sequence, key);
    }

    public Take(n: number): IEnumerator<T> {
        return Enumerable.Take(this.sequence, n);
    }

    public Skip(n: number): IEnumerator<T> {
        return Enumerable.Skip(this.sequence, n);
    }

    /**
     * Returns elements from a sequence as long as a specified condition is true.
    */
    public TakeWhile(predicate: (e: T) => boolean): IEnumerator<T> {
        return Enumerable.TakeWhile(this.sequence, predicate);
    }

    /**
     * Bypasses elements in a sequence as long as a specified condition is true 
     * and then returns the remaining elements.
    */
    public SkipWhile(predicate: (e: T) => boolean): IEnumerator<T> {
        return Enumerable.SkipWhile(this.sequence, predicate);
    }

    public All(predicate: (e: T) => boolean): boolean {
        return Enumerable.All(this.sequence, predicate);
    }

    public Any(predicate: (e: T) => boolean = null): boolean {
        if (predicate) {
            return Enumerable.Any(this.sequence, predicate);
        } else {
            if (!this.sequence || this.sequence.length == 0) {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * This function returns a clone copy of the source sequence.
    */
    public ToArray(): T[] {
        return [...this.sequence];
    }
}