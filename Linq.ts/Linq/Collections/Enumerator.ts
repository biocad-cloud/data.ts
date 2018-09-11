/**
 * Provides a set of static (Shared in Visual Basic) methods for querying 
 * objects that implement ``System.Collections.Generic.IEnumerable<T>``.
 * 
 * (这个枚举器类型是构建出一个Linq查询表达式所必须的基础类型，这是一个静态的集合，不会发生元素的动态添加或者删除)
*/
class IEnumerator<T> {

    /**
     * The data sequence with specific type.
    */
    protected sequence: T[];

    //#region "readonly property"

    /**
     * 获取序列的元素类型
    */
    public get ElementType(): TypeInfo {
        return TypeInfo.typeof(this.First);
    };

    /**
     * The number of elements in the data sequence.
    */
    public get Count(): number {
        return this.sequence.length;
    };

    public ElementAt(index: string | number = null): T {
        if (!index) {
            index = 0;
        } else if (typeof index == "string") {
            throw `Item index='${index}' must be an integer!`;
        }

        return this.sequence[index];
    }

    //#endregion

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
    }

    /**
     * Get the first element in this sequence 
    */
    public get First(): T {
        return this.sequence[0];
    }

    /**
     * Get the last element in this sequence 
    */
    public get Last(): T {
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
    public Select<TOut>(selector: (o: T, i: number) => TOut): IEnumerator<TOut> {
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
    public GroupBy<TKey>(
        keySelector: (o: T) => TKey,
        compares: (a: TKey, b: TKey) => number): IEnumerator<Group<TKey, T>> {

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
        return Enumerable.OrderBy(this.sequence, project).First;
    }

    /**
     * 求取这个序列集合的最大元素，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    public Max(project: (e: T) => number = (e) => DataExtensions.as_numeric(e)): T {
        return Enumerable.OrderByDescending(this.sequence, project).First;
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
    public OrderByDescending(key: (e: T) => number): IEnumerator<T> {
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
     * (与Where类似，只不过这个函数只要遇到第一个不符合条件的，就会立刻终止迭代)
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
     * 对序列中的元素进行去重
    */
    public Distinct(key: (o: T) => string = o => o.toString()): IEnumerator<T> {
        return this
            .GroupBy(key, Strings.CompareTo)
            .Select(group => group.First);
    }

    /**
     * 将序列按照符合条件的元素分成区块
     * 
     * @param isDelimiter 一个用于判断当前的元素是否是分割元素的函数
     * @param reserve 是否保留下这个分割对象？默认不保留
    */
    public ChunkWith(isDelimiter: (x: T) => boolean, reserve: boolean = false): IEnumerator<T[]> {
        var chunks: List<T[]> = new List<T[]>();
        var buffer: T[] = [];

        this.sequence.forEach(x => {
            if (isDelimiter(x)) {
                chunks.Add(buffer);

                if (reserve) {
                    buffer = [x];
                } else {
                    buffer = [];
                }
            } else {
                buffer.push(x);
            }
        });

        if (buffer.length > 0) {
            chunks.Add(buffer);
        }

        return chunks;
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

    public Unlist<U>(): IEnumerator<U> {
        var list: U[] = [];

        this.ForEach(a => {
            var array: U[] = (<any>a);
            array.forEach(x => list.push(x));
        })

        return new IEnumerator<U>(list);
    }

    //#region "conversion"

    /**
     * This function returns a clone copy of the source sequence.
    */
    public ToArray(): T[] {
        return [...this.sequence];
    }

    public ToList(): List<T> {
        return new List<T>(this.sequence);
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

    public SlideWindows(winSize: number, step: number = 1): IEnumerator<data.SlideWindow<T>> {
        return data.SlideWindow.Split(this, winSize, step);
    }

    //#endregion
}