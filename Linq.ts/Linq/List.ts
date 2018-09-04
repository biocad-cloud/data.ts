class List<T> extends IEnumerator<T> {

    public constructor(src: T[] | IEnumerator<T>) {
        super(src);
    }

    public Add(x: T): List<T> {
        this.sequence.push(x);
        return this;
    }

    public AddRange(x: T[] | IEnumerator<T>): List<T> {
        if (Array.isArray(x)) {
            x.forEach(o => this.sequence.push(o));
        } else {
            x.ForEach(o => this.sequence.push(o));
        }

        return this;
    }

    public IndexOf(x: T): number {
        return this.sequence.indexOf(x);
    }
}