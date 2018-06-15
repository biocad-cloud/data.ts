interface IEnumerable<T> {

}

class Enumerator<T> implements IEnumerable<T> {

    private sequence: T[];

    constructor(source: T[]) {
        this.sequence = source;
    }

    public Select<TOut>(selector: (o: T) => TOut): Enumerator<TOut> {
        return Enumerable.Select<T, TOut>(this.sequence, selector);
    }
}