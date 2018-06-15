interface IEnumerable<T> {

    /**
     * This function should returns a clone copy of the source sequence.
    */
    ToArray(): T[];
}

class Enumerator<T> implements IEnumerable<T> {

    /**
     * The data sequence with specific type.
    */
    private sequence: T[];

    constructor(source: T[]) {
        this.sequence = source;
    }

    public Select<TOut>(selector: (o: T) => TOut): Enumerator<TOut> {
        return Enumerable.Select<T, TOut>(this.sequence, selector);
    }

    public OrderBy(key: (e: T) => number): Enumerator<T> {
        return Enumerable.OrderBy(this.sequence, key);
    }

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