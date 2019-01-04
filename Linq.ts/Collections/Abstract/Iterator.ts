/**
  
  var it = makeIterator(['a', 'b']);

  it.next() // { value: "a", done: false }
  it.next() // { value: "b", done: false }
  it.next() // { value: undefined, done: true }

  function makeIterator(array) {
      var nextIndex = 0;
  
      return {
          next: function() {
              return nextIndex < array.length ?
                  {value: array[nextIndex++], done: false} :
                  {value: undefined, done: true};
          }
      };
  }

*/

class Iterator<T> {

    protected sequence: T[];

    private index: number = 0;

    public get Count(): number {
        return this.sequence.length;
    }

    public constructor(array: T[]) {
        this.sequence = array;
    }

    public reset(): Iterator<T> {
        this.index = 0;
        return this;
    }

    public next(): IPopulated<T> {
        return this.index < this.sequence.length ?
            <IPopulated<T>>{ value: this.sequence[this.index++], done: false } :
            <IPopulated<T>>{ value: undefined, done: true };
    }
}

interface IPopulated<T> {
    value: T;
    done: boolean;
}