/**
 * Provides a set of static (Shared in Visual Basic) methods for querying 
 * objects that implement ``System.Collections.Generic.IEnumerable<T>``.
 * 
 * (这个枚举器类型是构建出一个Linq查询表达式所必须的基础类型)
*/
export class IEnumerator<T> implements IEnumerable<T> {

    readonly [index: number]: T;

    /**
     * The number of elements in the data sequence.
    */
    readonly Count: number;

    /**
     * The data sequence with specific type.
    */
    protected sequence: T[];

    /**
     * 获取序列的元素类型
    */
    public get ElementType(): TypeInfo {
        return TypeInfo.typeof(this.First());
    }

    /**
     * 可以从一个数组或者枚举器构建出一个Linq序列
    */
    constructor(source: T[] | IEnumerator<T>) {
        if (!source) {
            this.sequence = [];
        } else if (Array.isArray(source)) {
            // 2018-07-31 为了防止外部修改source导致sequence数组被修改
            // 在这里进行数组复制，防止出现这种情况
            this.sequence = [...source];
        } else {
            this.sequence = [...source.sequence];
        }

        this.Count = this.sequence.length;
    }

    /**
     * Get the first element in this sequence 
    */
    public First(): T {
        return this.sequence[0];
    }

    /**
     * Get the last element in this sequence 
    */
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
     * 
     * @param compares 注意，javascript在进行中文字符串的比较的时候存在bug，如果当key的类型是字符串的时候，
     *                 在这里需要将key转换为数值进行比较，遇到中文字符串可能会出现bug
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

    /**
     * 求取这个序列集合的最小元素，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    public Min(project: (e: T) => number = (e) => DataExtensions.as_numeric(e)): T {
        return Enumerable.OrderBy(this.sequence, project).First();
    }

    /**
     * 求取这个序列集合的最大元素，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    public Max(project: (e: T) => number = (e) => DataExtensions.as_numeric(e)): T {
        return Enumerable.OrderByDescending(this.sequence, project).First();
    }

    /**
     * 求取这个序列集合的平均值，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    public Average(project: (e: T) => number = null): number {
        if (this.Count == 0) {
            return 0;
        } else {
            return this.Sum(project) / this.sequence.length;
        }
    }

    /**
     * 求取这个序列集合的和，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
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

    /**
     * 判断这个序列之中的所有元素是否都满足特定条件
    */
    public All(predicate: (e: T) => boolean): boolean {
        return Enumerable.All(this.sequence, predicate);
    }

    /**
     * 判断这个序列之中的任意一个元素是否满足特定的条件
    */
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
     * Performs the specified action for each element in an array.
     * 
     * @param callbackfn  A function that accepts up to three arguments. forEach 
     * calls the callbackfn function one time for each element in the array.
     * 
    */
    public ForEach(callbackfn: (x: T, index: number) => void) {
        this.sequence.forEach(callbackfn);
    }

    /**
     * Contract the data sequence to string
     * 
     * @param deli Delimiter string that using for the string.join function
     * @param toString A lambda that describ how to convert the generic type object to string token 
    */
    public JoinBy(
        deli: string,
        toString: (x: T) => string = (x: T) => {
            if (typeof x === "string") {
                return <string><any>x;
            } else {
                return x.toString();
            }
        }): string {

        return this.Select(x => toString(x))
            .ToArray()
            .join(deli);
    }

    /**
     * This function returns a clone copy of the source sequence.
    */
    public ToArray(): T[] {
        return [...this.sequence];
    }

    public ToDictionary<K, V>(
        keySelector: (x: T) => string,
        elementSelector: (x: T) => V = (X: T) => {
            return <V>(<any>X);
        }): Dictionary<V> {

        var maps = {};

        this.sequence.forEach(x => {
            // 2018-08-11 键名只能够是字符串类型的
            var key: string = keySelector(x);
            var value: V = elementSelector(x);

            maps[key] = value;
        })

        return new Dictionary<V>(maps);
    }

    public ToPointer(): Pointer<T> {
        return new Pointer<T>(this);
    }
}