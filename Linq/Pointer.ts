/// <reference path="Enumerator.ts" />

/**
 * A data sequence object with a internal index pointer.
*/
class Pointer<T> extends IEnumerator<T> {

    public i: number;

    public get EndRead(): boolean {
        return this.i >= this.Count;
    }

    public get Current(): T {
        return this.sequence[this.i];
    }

    public get Next(): T {
        var x = this.Current;
        this.i = this.i + 1;
        return x;
    }

    public constructor(src: T[] | IEnumerator<T>) {
        super(src);
    }
}