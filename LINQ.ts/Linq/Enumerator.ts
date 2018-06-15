interface IEnumerable<T> {

    /**
     * This function should returns a clone copy of the source sequence.
    */
    ToArray(): T[];
}

/**
 * Provides a set of static (Shared in Visual Basic) methods for querying 
 * objects that implement ``System.Collections.Generic.IEnumerable<T>``.
*/
class Enumerator<T> implements IEnumerable<T> {

    /**
     * The data sequence with specific type.
    */
    private sequence: T[];

    constructor(source: T[]) {
        this.sequence = source;
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
    public Select<TOut>(selector: (o: T) => TOut): Enumerator<TOut> {
        return Enumerable.Select<T, TOut>(this.sequence, selector);
    }

    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     * 
     * @param key A function to extract a key from an element.
     *
     * @returns An ``System.Linq.IOrderedEnumerable<T>`` whose elements are 
     *          sorted according to a key.
    */
    public OrderBy(key: (e: T) => number): Enumerator<T> {
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
    public OrderByOrderByDescending(key: (e: T) => number): Enumerator<T> {
        return Enumerable.OrderByDescending(this.sequence, key);
    }

    public Take(n: number): Enumerator<T> {
        return Enumerable.Take(this.sequence, n);
    }

    public Skip(n: number): Enumerator<T> {
        return Enumerable.Skip(this.sequence, n);
    }

    public TakeWhile(predicate: (e: T) => boolean): Enumerator<T> {
        return Enumerable.TakeWhile(this.sequence, predicate);
    }

    public SkipWhile(predicate: (e: T) => boolean): Enumerator<T> {
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