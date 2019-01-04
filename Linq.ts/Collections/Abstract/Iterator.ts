﻿/**
 * 可用于ES6的for循环的泛型迭代器对象，这个也是这个框架之中的所有序列模型的基础
 * 
 * ```js
 * var it = makeIterator(['a', 'b']);
 *
 * it.next() // { value: "a", done: false }
 * it.next() // { value: "b", done: false }
 * it.next() // { value: undefined, done: true }
 *
 * function makeIterator(array) {
 *     var nextIndex = 0;
 * 
 *     return {
 *         next: function() {
 *             return nextIndex < array.length ?
 *                 {value: array[nextIndex++], done: false} :
 *                 {value: undefined, done: true};
 *         }
 *     };
 * }
 * ```
*/
class Iterator<T> {

    /**
     * The data sequence with specific generic type.
    */
    protected sequence: T[];

    private index: number = 0;

    /**
     * 实现迭代器的关键元素之1
    */
    [Symbol.iterator]() { return this; }

    /**
     * The number of elements in the data sequence.
    */
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

    /**
     * 实现迭代器的关键元素之2
    */
    public next(): IPopulated<T> {
        return this.index < this.sequence.length ?
            <IPopulated<T>>{ value: this.sequence[this.index++], done: false } :
            <IPopulated<T>>{ value: undefined, done: true };
    }
}

/**
 * 迭代器对象所产生的一个当前的index状态值
*/
interface IPopulated<T> {
    value: T;
    done: boolean;
}