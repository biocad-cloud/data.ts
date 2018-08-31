/// <reference path="Enumerator.ts" />

/**
 * A data sequence object with a internal index pointer.
*/
class Pointer<T> extends IEnumerator<T> {

    /**
     * The index pointer of the current data sequence.
    */
    public i: number;

    /**
     * The index pointer is at the end of the data sequence?
    */
    public get EndRead(): boolean {
        return this.i >= this.Count;
    }

    /**
     * Get the element value in current location i;
    */
    public get Current(): T {
        return this.sequence[this.i];
    }

    /**
     * Get current index element value and then move the pointer 
     * to next position.
    */
    public get Next(): T {
        var x = this.Current;
        this.i = this.i + 1;
        return x;
    }

    public constructor(src: T[] | IEnumerator<T>) {
        super(src);
    }

    /**
     * Just move the pointer to the next position and then 
     * returns current pointer object.
    */
    public MoveNext(): Pointer<T> {
        this.i = this.i + 1;
        return this;
    }
}