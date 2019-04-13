var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var data;
(function (data) {
    var sprintf;
    (function (sprintf) {
        /**
         * 对占位符的匹配结果
        */
        var match = /** @class */ (function () {
            function match() {
            }
            match.prototype.toString = function () {
                return JSON.stringify(this);
            };
            return match;
        }());
        sprintf.match = match;
        /**
         * 格式化占位符
         *
         * Possible format values:
         *
         * + ``%%`` – Returns a percent sign
         * + ``%b`` – Binary number
         * + ``%c`` – The character according to the ASCII value
         * + ``%d`` – Signed decimal number
         * + ``%f`` – Floating-point number
         * + ``%o`` – Octal number
         * + ``%s`` – String
         * + ``%x`` – Hexadecimal number (lowercase letters)
         * + ``%X`` – Hexadecimal number (uppercase letters)
         *
         * Additional format values. These are placed between the % and the letter (example %.2f):
         *
         * + ``+``      (Forces both + and – in front of numbers. By default, only negative numbers are marked)
         * + ``–``      (Left-justifies the variable value)
         * + ``0``      zero will be used for padding the results to the right string size
         * + ``[0-9]``  (Specifies the minimum width held of to the variable value)
         * + ``.[0-9]`` (Specifies the number of decimal digits or maximum string length)
         *
        */
        sprintf.placeholder = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        function parseFormat(string, arguments) {
            var stringPosStart = 0;
            var stringPosEnd = 0;
            var matchPosEnd = 0;
            var convCount = 0;
            var match = null;
            var matches = [];
            var strings = [];
            while (match = sprintf.placeholder.exec(string)) {
                stringPosStart = matchPosEnd;
                stringPosEnd = sprintf.placeholder.lastIndex - match[0].length;
                strings[strings.length] = string.substring(stringPosStart, stringPosEnd);
                matchPosEnd = sprintf.placeholder.lastIndex;
                matches[matches.length] = {
                    match: match[0],
                    left: match[3] ? true : false,
                    sign: match[4] || '',
                    pad: match[5] || ' ',
                    min: match[6] || 0,
                    precision: match[8],
                    code: match[9] || '%',
                    negative: parseInt(arguments[convCount]) < 0 ? true : false,
                    argument: String(arguments[convCount])
                };
                if (match[9]) {
                    convCount += 1;
                }
            }
            strings[strings.length] = string.substring(matchPosEnd);
            return {
                matches: matches,
                convCount: convCount,
                strings: strings
            };
        }
        sprintf.parseFormat = parseFormat;
        /**
         * ### Javascript sprintf
         *
         * > http://www.webtoolkit.info/javascript-sprintf.html#.W5sf9FozaM8
         *
         * Several programming languages implement a sprintf function, to output a
         * formatted string. It originated from the C programming language, printf
         * function. Its a string manipulation function.
         *
         * This is limited sprintf Javascript implementation. Function returns a
         * string formatted by the usual printf conventions. See below for more details.
         * You must specify the string and how to format the variables in it.
        */
        function doFormat(format) {
            var argv = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argv[_i - 1] = arguments[_i];
            }
            if (typeof arguments == "undefined") {
                return null;
            }
            if (arguments.length < 1) {
                return null;
            }
            if (typeof arguments[0] != "string") {
                return null;
            }
            if (typeof RegExp == "undefined") {
                return null;
            }
            var parsed = sprintf.parseFormat(format, argv);
            var convCount = parsed.convCount;
            if (parsed.matches.length == 0) {
                // 没有格式化参数的占位符，则直接输出原本的字符串
                return format;
            }
            else {
                // console.log(parsed);
            }
            if (argv.length < convCount) {
                // 格式化参数的数量少于占位符的数量，则抛出错误
                throw "Mismatch format argument numbers (" + argv.length + " !== " + convCount + ")!";
            }
            else {
                return sprintf.doSubstitute(parsed.matches, parsed.strings);
            }
        }
        sprintf.doFormat = doFormat;
        /**
         * 进行格式化占位符对格式化参数的字符串替换操作
        */
        function doSubstitute(matches, strings) {
            var i = null;
            var substitution = null;
            var numVal = 0;
            var newString = '';
            for (i = 0; i < matches.length; i++) {
                if (matches[i].code == '%') {
                    substitution = '%';
                }
                else if (matches[i].code == 'b') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                    substitution = sprintf.convert(matches[i], true);
                }
                else if (matches[i].code == 'c') {
                    numVal = Math.abs(parseInt(matches[i].argument));
                    matches[i].argument = String(String.fromCharCode(parseInt(String(numVal))));
                    substitution = sprintf.convert(matches[i], true);
                }
                else if (matches[i].code == 'd') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                    substitution = sprintf.convert(matches[i]);
                }
                else if (matches[i].code == 'f') {
                    numVal = matches[i].precision ? parseFloat(matches[i].precision) : 6;
                    matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(numVal));
                    substitution = sprintf.convert(matches[i]);
                }
                else if (matches[i].code == 'o') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                    substitution = sprintf.convert(matches[i]);
                }
                else if (matches[i].code == 's') {
                    numVal = matches[i].precision ?
                        parseFloat(matches[i].precision) :
                        matches[i].argument.length;
                    matches[i].argument = matches[i].argument.substring(0, numVal);
                    substitution = sprintf.convert(matches[i], true);
                }
                else if (matches[i].code == 'x') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = sprintf.convert(matches[i]);
                }
                else if (matches[i].code == 'X') {
                    matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                    substitution = sprintf.convert(matches[i]).toUpperCase();
                }
                else {
                    substitution = matches[i].match;
                }
                newString += strings[i];
                newString += substitution;
            }
            return newString + strings[i];
        }
        sprintf.doSubstitute = doSubstitute;
        function convert(match, nosign) {
            if (nosign === void 0) { nosign = false; }
            if (nosign) {
                match.sign = '';
            }
            else {
                match.sign = match.negative ? '-' : match.sign;
            }
            var l = parseFloat(match.min) -
                match.argument.length + 1 -
                match.sign.length;
            var pad = new Array(l < 0 ? 0 : l).join(match.pad);
            if (!match.left) {
                if (match.pad == "0" || nosign) {
                    return match.sign + pad + match.argument;
                }
                else {
                    return pad + match.sign + match.argument;
                }
            }
            else {
                if (match.pad == "0" || nosign) {
                    return match.sign + match.argument + pad.replace(/0/g, ' ');
                }
                else {
                    return match.sign + match.argument + pad;
                }
            }
        }
        sprintf.convert = convert;
    })(sprintf = data.sprintf || (data.sprintf = {}));
})(data || (data = {}));
/**
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
var LINQIterator = /** @class */ (function () {
    function LINQIterator(array) {
        this.i = 0;
        this.sequence = array;
    }
    /**
     * 实现迭代器的关键元素之1
    */
    LINQIterator.prototype[Symbol.iterator] = function () { return this; };
    Object.defineProperty(LINQIterator.prototype, "Count", {
        /**
         * The number of elements in the data sequence.
        */
        get: function () {
            return this.sequence.length;
        },
        enumerable: true,
        configurable: true
    });
    LINQIterator.prototype.reset = function () {
        this.i = 0;
        return this;
    };
    /**
     * 实现迭代器的关键元素之2
    */
    LINQIterator.prototype.next = function () {
        return this.i < this.sequence.length ?
            { value: this.sequence[this.i++], done: false } :
            { value: undefined, done: true };
    };
    return LINQIterator;
}());
//// <reference path="Enumerator.ts" />
/**
 * The linq pipline implements at here. (在这个模块之中实现具体的数据序列算法)
*/
var Enumerable;
(function (Enumerable) {
    function Range(from, to, steps) {
        if (steps === void 0) { steps = 1; }
        return new data.NumericRange(from, to).PopulateNumbers(steps);
    }
    Enumerable.Range = Range;
    function Min() {
        var v = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            v[_i] = arguments[_i];
        }
        var min = 99999999999;
        for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
            var x = v_1[_a];
            if (x < min) {
                min = x;
            }
        }
        return min;
    }
    Enumerable.Min = Min;
    /**
     * 进行数据序列的投影操作
     *
    */
    function Select(source, project) {
        var projections = [];
        source.forEach(function (o, i) {
            projections.push(project(o, i));
        });
        return new IEnumerator(projections);
    }
    Enumerable.Select = Select;
    /**
     * 进行数据序列的排序操作
     *
    */
    function OrderBy(source, key) {
        // array clone
        var clone = source.slice();
        clone.sort(function (a, b) {
            // a - b
            return key(a) - key(b);
        });
        // console.log("clone");
        // console.log(clone);
        return new IEnumerator(clone);
    }
    Enumerable.OrderBy = OrderBy;
    function OrderByDescending(source, key) {
        return Enumerable.OrderBy(source, function (e) {
            // b - a
            return -key(e);
        });
    }
    Enumerable.OrderByDescending = OrderByDescending;
    function Take(source, n) {
        var takes = [];
        var len = source.length;
        if (len <= n) {
            takes = source;
        }
        else {
            takes = [];
            for (var i = 0; i < n; i++) {
                if (i >= len) {
                    break;
                }
                else {
                    takes.push(source[i]);
                }
            }
        }
        return new IEnumerator(takes);
    }
    Enumerable.Take = Take;
    function Skip(source, n) {
        var takes = [];
        if (n >= source.length) {
            return new IEnumerator([]);
        }
        for (var i = n; i < source.length; i++) {
            takes.push(source[i]);
        }
        return new IEnumerator(takes);
    }
    Enumerable.Skip = Skip;
    function TakeWhile(source, predicate) {
        var takes = [];
        for (var i = 0; i < source.length; i++) {
            if (predicate(source[i])) {
                takes.push(source[i]);
            }
            else {
                break;
            }
        }
        return new IEnumerator(takes);
    }
    Enumerable.TakeWhile = TakeWhile;
    function Where(source, predicate) {
        var takes = [];
        source.forEach(function (o) {
            if (true == predicate(o)) {
                takes.push(o);
            }
        });
        return new IEnumerator(takes);
    }
    Enumerable.Where = Where;
    function SkipWhile(source, predicate) {
        for (var i = 0; i < source.length; i++) {
            if (true == predicate(source[i])) {
                // skip
            }
            else {
                // end skip
                return Enumerable.Skip(source, i);
            }
        }
        // skip all
        return new IEnumerator([]);
    }
    Enumerable.SkipWhile = SkipWhile;
    function All(source, predicate) {
        for (var i = 0; i < source.length; i++) {
            if (!predicate(source[i])) {
                return false;
            }
        }
        return true;
    }
    Enumerable.All = All;
    function Any(source, predicate) {
        for (var i = 0; i < source.length; i++) {
            if (true == predicate(source[i])) {
                return true;
            }
        }
        return false;
    }
    Enumerable.Any = Any;
    /**
     * Implements a ``group by`` operation by binary tree data structure.
    */
    function GroupBy(source, getKey, compares) {
        var tree = new algorithm.BTree.binaryTree(compares);
        source.forEach(function (obj) {
            var key = getKey(obj);
            var list = tree.find(key);
            if (list) {
                list.push(obj);
            }
            else {
                tree.add(key, [obj]);
            }
        });
        console.log(tree);
        return tree.AsEnumerable().Select(function (node) {
            return new Group(node.key, node.value);
        });
    }
    Enumerable.GroupBy = GroupBy;
    function AllKeys(sequence) {
        return From(sequence)
            .Select(function (o) { return Object.keys(o); })
            .Unlist()
            .Distinct()
            .ToArray();
    }
    Enumerable.AllKeys = AllKeys;
    var JoinHelper = /** @class */ (function () {
        function JoinHelper(x, y) {
            this.xset = x;
            this.yset = y;
            this.keysT = AllKeys(x);
            this.keysU = AllKeys(y);
        }
        JoinHelper.prototype.JoinProject = function (x, y) {
            var out = {};
            this.keysT.forEach(function (k) { return out[k] = x[k]; });
            this.keysU.forEach(function (k) { return out[k] = y[k]; });
            return out;
        };
        JoinHelper.prototype.Union = function (tKey, uKey, compare, project) {
            if (project === void 0) { project = this.JoinProject; }
            var tree = this.buildUtree(uKey, compare);
            var output = [];
            var keyX = new algorithm.BTree.binaryTree(compare);
            this.xset.forEach(function (x) {
                var key = tKey(x);
                var list = tree.find(key);
                if (list) {
                    // 有交集，则进行叠加投影
                    list.forEach(function (y) { return output.push(project(x, y)); });
                    if (!keyX.find(key)) {
                        keyX.add(key);
                    }
                }
                else {
                    // 没有交集，则投影空对象
                    output.push(project(x, {}));
                }
            });
            this.yset.forEach(function (y) {
                var key = uKey(y);
                if (!keyX.find(key)) {
                    // 没有和X进行join，则需要union到最终的结果之中
                    // 这个y是找不到对应的x元素的
                    output.push(project({}, y));
                }
            });
            return new IEnumerator(output);
        };
        JoinHelper.prototype.buildUtree = function (uKey, compare) {
            var tree = new algorithm.BTree.binaryTree(compare);
            this.yset.forEach(function (obj) {
                var key = uKey(obj);
                var list = tree.find(key);
                if (list) {
                    list.push(obj);
                }
                else {
                    tree.add(key, [obj]);
                }
            });
            return tree;
        };
        JoinHelper.prototype.LeftJoin = function (tKey, uKey, compare, project) {
            if (project === void 0) { project = this.JoinProject; }
            var tree = this.buildUtree(uKey, compare);
            var output = [];
            this.xset.forEach(function (x) {
                var key = tKey(x);
                var list = tree.find(key);
                if (list) {
                    // 有交集，则进行叠加投影
                    list.forEach(function (y) { return output.push(project(x, y)); });
                }
                else {
                    // 没有交集，则投影空对象
                    output.push(project(x, {}));
                }
            });
            return new IEnumerator(output);
        };
        return JoinHelper;
    }());
    Enumerable.JoinHelper = JoinHelper;
})(Enumerable || (Enumerable = {}));
/// <reference path="Iterator.ts" />
/// <reference path="Enumerable.ts" />
/**
 * Provides a set of static (Shared in Visual Basic) methods for querying
 * objects that implement ``System.Collections.Generic.IEnumerable<T>``.
 *
 * (这个枚举器类型是构建出一个Linq查询表达式所必须的基础类型，这是一个静态的集合，不会发生元素的动态添加或者删除)
*/
var IEnumerator = /** @class */ (function (_super) {
    __extends(IEnumerator, _super);
    //#endregion
    /**
     * 可以从一个数组或者枚举器构建出一个Linq序列
     *
     * @param source The enumerator data source, this constructor will perform
     *       a sequence copy action on this given data source sequence at here.
    */
    function IEnumerator(source) {
        return _super.call(this, IEnumerator.getArray(source)) || this;
    }
    Object.defineProperty(IEnumerator.prototype, "ElementType", {
        //#region "readonly property"
        /**
         * 获取序列的元素类型
        */
        get: function () {
            return TypeInfo.typeof(this.First);
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Get the element value at a given index position
     * of this data sequence.
     *
     * @param index index value should be an integer value.
    */
    IEnumerator.prototype.ElementAt = function (index) {
        if (index === void 0) { index = null; }
        if (!index) {
            index = 0;
        }
        else if (typeof index == "string") {
            throw "Item index='" + index + "' must be an integer!";
        }
        return this.sequence[index];
    };
    IEnumerator.getArray = function (source) {
        if (!source) {
            return [];
        }
        else if (Array.isArray(source)) {
            // 2018-07-31 为了防止外部修改source导致sequence数组被修改
            // 在这里进行数组复制，防止出现这种情况
            return source.slice();
        }
        else {
            return source.sequence.slice();
        }
    };
    IEnumerator.prototype.indexOf = function (x) {
        return this.sequence.indexOf(x);
    };
    Object.defineProperty(IEnumerator.prototype, "First", {
        /**
         * Get the first element in this sequence
        */
        get: function () {
            return this.sequence[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IEnumerator.prototype, "Last", {
        /**
         * Get the last element in this sequence
        */
        get: function () {
            return this.sequence[this.Count - 1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If the sequence length is zero, then returns the default value.
    */
    IEnumerator.prototype.FirstOrDefault = function (Default) {
        if (Default === void 0) { Default = null; }
        if (this.Count == 0) {
            return Default;
        }
        else {
            return this.sequence[0];
        }
    };
    /**
     * 两个序列求总和
    */
    IEnumerator.prototype.Union = function (another, tKey, uKey, compare, project) {
        if (project === void 0) { project = null; }
        if (!Array.isArray(another)) {
            another = another.ToArray();
        }
        var join = new Enumerable.JoinHelper(this.sequence, another);
        return join.Union(tKey, uKey, compare, project);
    };
    /**
     * 如果在another序列之中找不到对应的对象，则当前序列会和一个空对象合并
     * 如果another序列之中有多余的元素，即该元素在当前序列之中找不到的元素，会被扔弃
     *
     * @param project 如果这个参数被忽略掉了的话，将会直接进行属性的合并
    */
    IEnumerator.prototype.Join = function (another, tKey, uKey, compare, project) {
        if (project === void 0) { project = null; }
        if (!Array.isArray(another)) {
            another = another.ToArray();
        }
        var join = new Enumerable.JoinHelper(this.sequence, another);
        return join.LeftJoin(tKey, uKey, compare, project);
    };
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
    IEnumerator.prototype.Select = function (selector) {
        return Enumerable.Select(this.sequence, selector);
    };
    /**
     * Groups the elements of a sequence according to a key selector function.
     * The keys are compared by using a comparer and each group's elements
     * are projected by using a specified function.
     *
     * @param compares 注意，javascript在进行中文字符串的比较的时候存在bug，如果当key的类型是字符串的时候，
     *                 在这里需要将key转换为数值进行比较，遇到中文字符串可能会出现bug
    */
    IEnumerator.prototype.GroupBy = function (keySelector, compares) {
        if (isNullOrUndefined(compares)) {
            var x = keySelector(this.First);
            switch (typeof x) {
                case "string":
                    compares = Strings.CompareTo;
                    break;
                case "number":
                    compares = (function (x, y) { return x - y; });
                    break;
                case "boolean":
                    compares = (function (x, y) {
                        if (x == y) {
                            return 0;
                        }
                        // 有一个肯定是false
                        if (x == true) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    });
                    break;
                default:
                    throw "No element comparer was specific!";
            }
        }
        return Enumerable.GroupBy(this.sequence, keySelector, compares);
    };
    /**
     * Filters a sequence of values based on a predicate.
     *
     * @param predicate A test condition function.
     *
     * @returns Sub sequence of the current sequence with all
     *     element test pass by the ``predicate`` function.
    */
    IEnumerator.prototype.Where = function (predicate) {
        return Enumerable.Where(this.sequence, predicate);
    };
    /**
     * Get the min value in current sequence.
     * (求取这个序列集合的最小元素，使用这个函数要求序列之中的元素都必须能够被转换为数值)
    */
    IEnumerator.prototype.Min = function (project) {
        if (project === void 0) { project = function (e) { return DataExtensions.as_numeric(e); }; }
        return Enumerable.OrderBy(this.sequence, project).First;
    };
    /**
     * Get the max value in current sequence.
     * (求取这个序列集合的最大元素，使用这个函数要求序列之中的元素都必须能够被转换为数值)
    */
    IEnumerator.prototype.Max = function (project) {
        if (project === void 0) { project = function (e) { return DataExtensions.as_numeric(e); }; }
        return Enumerable.OrderByDescending(this.sequence, project).First;
    };
    /**
     * 求取这个序列集合的平均值，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    IEnumerator.prototype.Average = function (project) {
        if (project === void 0) { project = null; }
        if (this.Count == 0) {
            return 0;
        }
        else {
            return this.Sum(project) / this.sequence.length;
        }
    };
    /**
     * 求取这个序列集合的和，使用这个函数要求序列之中的元素都必须能够被转换为数值
    */
    IEnumerator.prototype.Sum = function (project) {
        if (project === void 0) { project = null; }
        var x = 0;
        if (!project)
            project = function (e) {
                return Number(e);
            };
        for (var i = 0; i < this.sequence.length; i++) {
            x += project(this.sequence[i]);
        }
        return x;
    };
    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     *
     * @param key A function to extract a key from an element.
     *
     * @returns An ``System.Linq.IOrderedEnumerable<T>`` whose elements are
     *          sorted according to a key.
    */
    IEnumerator.prototype.OrderBy = function (key) {
        return Enumerable.OrderBy(this.sequence, key);
    };
    /**
     * Sorts the elements of a sequence in descending order according to a key.
     *
     * @param key A function to extract a key from an element.
     *
     * @returns An ``System.Linq.IOrderedEnumerable<T>`` whose elements are
     *          sorted in descending order according to a key.
    */
    IEnumerator.prototype.OrderByDescending = function (key) {
        return Enumerable.OrderByDescending(this.sequence, key);
    };
    /**
     * 取出序列之中的前n个元素
    */
    IEnumerator.prototype.Take = function (n) {
        return Enumerable.Take(this.sequence, n);
    };
    /**
     * 跳过序列的前n个元素之后返回序列之中的所有剩余元素
    */
    IEnumerator.prototype.Skip = function (n) {
        return Enumerable.Skip(this.sequence, n);
    };
    /**
     * 序列元素的位置反转
    */
    IEnumerator.prototype.Reverse = function () {
        var rseq = this.ToArray().reverse();
        return new IEnumerator(rseq);
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * (与Where类似，只不过这个函数只要遇到第一个不符合条件的，就会立刻终止迭代)
    */
    IEnumerator.prototype.TakeWhile = function (predicate) {
        return Enumerable.TakeWhile(this.sequence, predicate);
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true
     * and then returns the remaining elements.
    */
    IEnumerator.prototype.SkipWhile = function (predicate) {
        return Enumerable.SkipWhile(this.sequence, predicate);
    };
    /**
     * 判断这个序列之中的所有元素是否都满足特定条件
    */
    IEnumerator.prototype.All = function (predicate) {
        return Enumerable.All(this.sequence, predicate);
    };
    /**
     * 判断这个序列之中的任意一个元素是否满足特定的条件
    */
    IEnumerator.prototype.Any = function (predicate) {
        if (predicate === void 0) { predicate = null; }
        if (predicate) {
            return Enumerable.Any(this.sequence, predicate);
        }
        else {
            if (!this.sequence || this.sequence.length == 0) {
                return false;
            }
            else {
                return true;
            }
        }
    };
    /**
     * 对序列中的元素进行去重
    */
    IEnumerator.prototype.Distinct = function (key) {
        if (key === void 0) { key = function (o) { return o.toString(); }; }
        return this
            .GroupBy(key, Strings.CompareTo)
            .Select(function (group) { return group.First; });
    };
    /**
     * 将序列按照符合条件的元素分成区块
     *
     * @param isDelimiter 一个用于判断当前的元素是否是分割元素的函数
     * @param reserve 是否保留下这个分割对象？默认不保留
    */
    IEnumerator.prototype.ChunkWith = function (isDelimiter, reserve) {
        if (reserve === void 0) { reserve = false; }
        var chunks = new List();
        var buffer = [];
        this.sequence.forEach(function (x) {
            if (isDelimiter(x)) {
                chunks.Add(buffer);
                if (reserve) {
                    buffer = [x];
                }
                else {
                    buffer = [];
                }
            }
            else {
                buffer.push(x);
            }
        });
        if (buffer.length > 0) {
            chunks.Add(buffer);
        }
        return chunks;
    };
    /**
     * Performs the specified action for each element in an array.
     *
     * @param callbackfn  A function that accepts up to three arguments. forEach
     * calls the callbackfn function one time for each element in the array.
     *
    */
    IEnumerator.prototype.ForEach = function (callbackfn) {
        this.sequence.forEach(callbackfn);
    };
    /**
     * Contract the data sequence to string
     *
     * @param deli Delimiter string that using for the string.join function
     * @param toString A lambda that describ how to convert the generic type object to string token
     *
     * @returns A contract string.
    */
    IEnumerator.prototype.JoinBy = function (deli, toString) {
        if (toString === void 0) { toString = function (x) {
            if (typeof x === "string") {
                return x;
            }
            else {
                return x.toString();
            }
        }; }
        return this.Select(function (x) { return toString(x); })
            .ToArray()
            .join(deli);
    };
    /**
     * 如果当前的这个数据序列之中的元素的类型是某一种元素类型的集合，或者该元素
     * 可以描述为另一种类型的元素的集合，则可以通过这个函数来进行降维操作处理。
     *
     * @param project 这个投影函数描述了如何将某一种类型的元素降维至另外一种元素类型的集合。
     * 如果这个函数被忽略掉的话，会尝试强制将当前集合的元素类型转换为目标元素类型的数组集合。
    */
    IEnumerator.prototype.Unlist = function (project) {
        if (project === void 0) { project = function (obj) { return obj; }; }
        var list = [];
        this.ForEach(function (a) {
            project(a).forEach(function (x) { return list.push(x); });
        });
        return new IEnumerator(list);
    };
    //#region "conversion"
    /**
     * This function returns a clone copy of the source sequence.
     *
     * @param clone If this parameter is false, then this function will
     * returns the origin array sequence directly.
    */
    IEnumerator.prototype.ToArray = function (clone) {
        if (clone === void 0) { clone = true; }
        if (clone) {
            return this.sequence.slice();
        }
        else {
            return this.sequence;
        }
    };
    /**
     * 将当前的这个不可变的只读序列对象转换为可动态增添删除元素的列表对象
    */
    IEnumerator.prototype.ToList = function () {
        return new List(this.sequence);
    };
    /**
     * 将当前的这个数据序列对象转换为键值对字典对象，方便用于数据的查找操作
    */
    IEnumerator.prototype.ToDictionary = function (keySelector, elementSelector) {
        if (elementSelector === void 0) { elementSelector = function (X) {
            return X;
        }; }
        var maps = {};
        this.sequence.forEach(function (x) {
            // 2018-08-11 键名只能够是字符串类型的
            var key = keySelector(x);
            var value = elementSelector(x);
            maps[key] = value;
        });
        return new Dictionary(maps);
    };
    /**
     * 将当前的这个数据序列转换为包含有内部位置指针数据的指针对象
    */
    IEnumerator.prototype.ToPointer = function () {
        return new Pointer(this);
    };
    /**
     * 将当前的这个序列转换为一个滑窗数据的集合
    */
    IEnumerator.prototype.SlideWindows = function (winSize, step) {
        if (step === void 0) { step = 1; }
        return SlideWindow.Split(this, winSize, step);
    };
    return IEnumerator;
}(LINQIterator));
/// <reference path="../Collections/Abstract/Enumerator.ts" />
// 2018-12-06
// 为了方便书写代码，在其他脚本之中添加变量类型申明，在这里就不进行命名空间的包裹了
// /**
//  * Creates an instance of the element for the specified tag.
//  * @param tagName The name of an element.
// */
// createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options ?: ElementCreationOptions): HTMLElementTagNameMap[K];
var DOMEnumerator = /** @class */ (function (_super) {
    __extends(DOMEnumerator, _super);
    /**
     * 1. IEnumerator
     * 2. NodeListOf
     * 3. HTMLCollection
    */
    function DOMEnumerator(elements) {
        return _super.call(this, DOMEnumerator.ensureElements(elements)) || this;
    }
    /**
     * 这个函数确保所传递进来的集合总是输出一个数组，方便当前的集合对象向其基类型传递数据源
    */
    DOMEnumerator.ensureElements = function (elements) {
        var type = TypeInfo.typeof(elements);
        var list;
        /**
         * TypeInfo {typeOf: "object", class: "NodeList", property: Array(2), methods: Array(5)}
         * IsArray: false
         * IsEnumerator: false
         * IsPrimitive: false
         * class: "NodeList"
         * methods: (5) ["item", "entries", "forEach", "keys", "values"]
         * property: (2) ["0", "1"]
         * typeOf: "object"
        */
        if (type.class == "NodeList") {
            list = [];
            elements.forEach(function (x) { return list.push(x); });
        }
        else if (type.class == "HTMLCollection") {
            var collection = elements;
            list = [];
            for (var i = 0; i < collection.length; i++) {
                list.push(collection.item(i));
            }
        }
        else {
            list = Framework.Extensions.EnsureArray(elements);
        }
        // 在最后进行元素拓展
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var node = list_1[_i];
            TypeExtensions.Extends(node);
        }
        return list;
    };
    /**
     * 使用这个函数进行节点值的设置或者获取
     *
     * 这个函数不传递任何参数则表示获取值
     *
     * @param value 如果需要批量清除节点之中的值的话，需要传递一个空字符串，而非空值
    */
    DOMEnumerator.prototype.val = function (value) {
        if (value === void 0) { value = null; }
        if (isNullOrUndefined(value)) {
            return this.Select(function (element) { return DOMEnumerator.getVal(element); });
        }
        else {
            if (typeof value == "string" || typeof value == "number") {
                // 所有元素都设置同一个值
                this.ForEach(function (e) { return DOMEnumerator.setVal(e, value); });
            }
            else if (Array.isArray(value)) {
                this.ForEach(function (e, i) { return DOMEnumerator.setVal(e, value[i]); });
            }
            else {
                this.ForEach(function (e, i) { return DOMEnumerator.setVal(e, value.ElementAt(i)); });
            }
        }
    };
    DOMEnumerator.setVal = function (element, text) {
        if (element instanceof HTMLInputElement) {
            element.value = text;
        }
        else {
            element.textContent = text;
        }
    };
    DOMEnumerator.getVal = function (element) {
        if (element instanceof HTMLInputElement) {
            return element.value;
        }
        else {
            return element.textContent;
        }
    };
    /**
     * 使用这个函数设置或者获取属性值
     *
     * @param attrName 属性名称
     * @param val + 如果为字符串值，则当前的结合之中的所有的节点的指定属性都将设置为相同的属性值
     *            + 如果为字符串集合或者字符串数组，则会分别设置对应的index的属性值
     *            + 如果是一个函数，则会设置根据该节点所生成的字符串为属性值
     *
     * @returns 函数总是会返回所设置的或者读取得到的属性值的字符串集合
    */
    DOMEnumerator.prototype.attr = function (attrName, val) {
        if (val === void 0) { val = null; }
        if (val) {
            if (typeof val == "function") {
                return this.Select(function (x) {
                    var value = val(x);
                    x.setAttribute(attrName, value);
                    return value;
                });
            }
            else {
                var array = Framework.Extensions.EnsureArray(val, this.Count);
                return this.Select(function (x, i) {
                    var value = array[i];
                    x.setAttribute(attrName, value);
                    return value;
                });
            }
        }
        else {
            return this.Select(function (x) { return x.getAttribute(attrName); });
        }
    };
    DOMEnumerator.prototype.AddClass = function (className) {
        this.ForEach(function (x) {
            if (!x.classList.contains(className)) {
                x.classList.add(className);
            }
        });
        return this;
    };
    DOMEnumerator.prototype.AddEvent = function (eventName, handler) {
        this.ForEach(function (element) {
            var event = function (Event) {
                handler(element, Event);
            };
            DOM.addEvent(element, eventName, event);
        });
    };
    DOMEnumerator.prototype.onChange = function (handler) {
        this.AddEvent("onchange", handler);
    };
    /**
     * 为当前的html节点集合添加鼠标点击事件处理函数
    */
    DOMEnumerator.prototype.onClick = function (handler) {
        this.ForEach(function (element) {
            element.onclick = function (ev) {
                handler(this, ev);
                return false;
            };
        });
    };
    DOMEnumerator.prototype.RemoveClass = function (className) {
        this.ForEach(function (x) {
            if (x.classList.contains(className)) {
                x.classList.remove(className);
            }
        });
        return this;
    };
    /**
     * 通过设置css之中的display值来将集合之中的所有的节点元素都隐藏掉
    */
    DOMEnumerator.prototype.hide = function () {
        this.ForEach(function (x) { return x.style.display = "none"; });
        return this;
    };
    /**
     * 通过设置css之中的display值来将集合之中的所有的节点元素都显示出来
    */
    DOMEnumerator.prototype.show = function () {
        this.ForEach(function (x) { return x.style.display = "block"; });
        return this;
    };
    /**
     * 将所选定的节点批量删除
    */
    DOMEnumerator.prototype.Delete = function () {
        this.ForEach(function (x) { return x.parentNode.removeChild(x); });
    };
    return DOMEnumerator;
}(IEnumerator));
/// <reference path="../../../DOM/DOMEnumerator.ts" />
var Internal;
(function (Internal) {
    var Handlers;
    (function (Handlers) {
        var events = {
            onclick: "onclick"
        };
        var eventFuncNames = Object.keys(events);
        function hasKey(object, key) {
            // hasOwnProperty = Object.prototype.hasOwnProperty
            return object ? window.hasOwnProperty.call(object, key) : false;
        }
        Handlers.hasKey = hasKey;
        /**
         * 这个函数确保给定的id字符串总是以符号``#``开始的
        */
        function EnsureNodeId(str) {
            if (!str) {
                throw "The given node id value is nothing!";
            }
            else if (str[0] == "#") {
                return str;
            }
            else {
                return "#" + str;
            }
        }
        Handlers.EnsureNodeId = EnsureNodeId;
        /**
         * 字符串格式的值意味着对html文档节点的查询
        */
        var stringEval = /** @class */ (function () {
            function stringEval() {
            }
            stringEval.ensureArguments = function (args) {
                if (isNullOrUndefined(args)) {
                    return Internal.Arguments.Default();
                }
                else {
                    var opts = args;
                    // 2018-10-16
                    // 如果不在这里进行判断赋值，则nativeModel属性的值为undefined
                    // 会导致总会判断为true的bug出现
                    if (isNullOrUndefined(opts.nativeModel)) {
                        // 为了兼容以前的代码，在这里总是默认为TRUE
                        opts.nativeModel = true;
                    }
                    return opts;
                }
            };
            /**
             * @param query 函数会在这里自动的处理转义问题
             * @param context 默认为当前的窗口文档
            */
            stringEval.select = function (query, context) {
                if (context === void 0) { context = window; }
                // https://mathiasbynens.be/notes/css-escapes
                var cssSelector = query.replace(":", "\\:");
                // 返回节点集合
                var nodes;
                if (context instanceof Window) {
                    nodes = context
                        .document
                        .querySelectorAll(cssSelector);
                }
                else if (context instanceof HTMLElement) {
                    nodes = context.querySelectorAll(cssSelector);
                }
                else {
                    throw "Unsupported context type: " + TypeInfo.getClass(context);
                }
                var it = new DOMEnumerator(nodes);
                return it;
            };
            stringEval.prototype.doEval = function (expr, type, args) {
                var query = DOM.Query.parseQuery(expr);
                var argument = stringEval.ensureArguments(args);
                // 默认查询的上下文环境为当前的文档
                var context = argument.context || window;
                if (query.type == DOM.QueryTypes.id) {
                    // 按照id查询
                    var node = context
                        .document
                        .getElementById(query.expression);
                    if (isNullOrUndefined(node)) {
                        if (TypeScript.logging.outputWarning) {
                            console.warn("Unable to found a node which its ID='" + expr + "'!");
                        }
                        return null;
                    }
                    else {
                        if (argument.nativeModel) {
                            return TypeExtensions.Extends(node);
                        }
                        else {
                            return new HTMLTsElement(node);
                        }
                    }
                }
                else if (query.type == DOM.QueryTypes.NoQuery) {
                    return stringEval.createNew(expr, argument, context);
                }
                else if (!query.singleNode) {
                    return stringEval.select(query.expression, context);
                }
                else if (query.type == DOM.QueryTypes.QueryMeta) {
                    // meta标签查询默认是可以在父节点文档之中查询的
                    // 所以在这里不需要context上下文环境
                    return DOM.metaValue(query.expression, (args || {})["default"], context != window);
                }
                else {
                    if (TypeScript.logging.outputEverything) {
                        console.warn("Apply querySelector for expression: '" + query.expression + "', no typescript extension was made!");
                    }
                    // 只返回第一个满足条件的节点
                    return context
                        .document
                        .querySelector(query.expression);
                }
            };
            /**
             * 创建新的HTML节点元素
            */
            stringEval.createNew = function (expr, args, context) {
                if (context === void 0) { context = window; }
                var declare = DOM.ParseNodeDeclare(expr);
                var node = context
                    .document
                    .createElement(declare.tag);
                // 赋值节点申明的字符串表达式之中所定义的属性
                declare.attrs
                    .forEach(function (attr) {
                    if (eventFuncNames.indexOf(attr.name) < 0) {
                        node.setAttribute(attr.name, attr.value);
                    }
                });
                // 赋值额外的属性参数
                if (args) {
                    stringEval.setAttributes(node, args);
                }
                if (args.nativeModel) {
                    return TypeExtensions.Extends(node);
                }
                else {
                    return new HTMLTsElement(node);
                }
            };
            stringEval.setAttributes = function (node, attrs) {
                var setAttr = function (name) {
                    if (eventFuncNames.indexOf(name) > -1) {
                        return;
                    }
                    if (name == "class") {
                        var classVals = attrs[name];
                        if (Array.isArray(classVals)) {
                            classVals.forEach(function (c) { return node.classList.add(c); });
                        }
                        else {
                            node.setAttribute(name, classVals);
                        }
                    }
                    else if (name == "style") {
                        if (typeof attrs == "string") {
                            node.setAttribute(name, attrs);
                        }
                        else {
                            // node.style是一个只读属性，无法直接赋值
                            for (var propertyName in attrs) {
                                node.style[propertyName] = attrs[propertyName];
                            }
                        }
                    }
                    else {
                        node.setAttribute(name, attrs[name]);
                    }
                };
                Internal.Arguments.nameFilter(attrs).forEach(function (name) { return setAttr(name); });
                // 添加事件
                if (hasKey(attrs, events.onclick)) {
                    var onclick_1 = attrs[events.onclick];
                    if (typeof onclick_1 == "string") {
                        node.setAttribute(events.onclick, onclick_1);
                    }
                    else {
                        node.onclick = onclick_1;
                    }
                }
            };
            return stringEval;
        }());
        Handlers.stringEval = stringEval;
    })(Handlers = Internal.Handlers || (Internal.Handlers = {}));
})(Internal || (Internal = {}));
/// <reference path="./stringEval.ts" />
var Internal;
(function (Internal) {
    var Handlers;
    (function (Handlers) {
        /**
         * 在这个字典之中的键名称主要有两大类型:
         *
         * + typeof 类型判断结果
         * + TypeInfo.class 类型名称
        */
        Handlers.Shared = {
            /**
             * HTML document query handler
            */
            string: function () { return new Handlers.stringEval(); },
            /**
             * Create a linq object
            */
            array: function () { return new arrayEval(); },
            NodeListOf: function () { return new DOMCollection(); },
            HTMLCollection: function () { return new DOMCollection(); }
        };
        /**
         * Create a Linq Enumerator
        */
        var arrayEval = /** @class */ (function () {
            function arrayEval() {
            }
            arrayEval.prototype.doEval = function (expr, type, args) {
                return From(expr);
            };
            return arrayEval;
        }());
        Handlers.arrayEval = arrayEval;
        var DOMCollection = /** @class */ (function () {
            function DOMCollection() {
            }
            DOMCollection.prototype.doEval = function (expr, type, args) {
                return new DOMEnumerator(expr);
            };
            return DOMCollection;
        }());
        Handlers.DOMCollection = DOMCollection;
    })(Handlers = Internal.Handlers || (Internal.Handlers = {}));
})(Internal || (Internal = {}));
/**
 * 通用数据拓展函数集合
*/
var DataExtensions;
(function (DataExtensions) {
    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    DataExtensions.arrayBufferToBase64 = arrayBufferToBase64;
    /**
     * 将uri之中的base64字符串数据转换为一个byte数据流
    */
    function uriToBlob(uri) {
        var byteString = window.atob(uri.split(',')[1]);
        var mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
        var buffer = new ArrayBuffer(byteString.length);
        var intArray = new Uint8Array(buffer);
        for (var i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([buffer], { type: mimeString });
    }
    DataExtensions.uriToBlob = uriToBlob;
    /**
     * 将URL查询字符串解析为字典对象，所传递的查询字符串应该是查询参数部分，即问号之后的部分，而非完整的url
     *
     * @param queryString URL查询参数
     * @param lowerName 是否将所有的参数名称转换为小写形式？
     *
     * @returns 键值对形式的字典对象
    */
    function parseQueryString(queryString, lowerName) {
        if (lowerName === void 0) { lowerName = false; }
        // stuff after # is not part of query string, so get rid of it
        // split our query string into its component parts
        var arr = queryString.split('#')[0].split('&');
        // we'll store the parameters here
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');
            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? "true" : a[1];
            if (lowerName) {
                paramName = paramName.toLowerCase();
            }
            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    // if no array index number specified...
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                else {
                    // if array index number specified...
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                // if param name doesn't exist yet, set it
                obj[paramName] = paramValue;
            }
        }
        return obj;
    }
    DataExtensions.parseQueryString = parseQueryString;
    /**
     * 尝试将任意类型的目标对象转换为数值类型
     *
     * @returns 一个数值
    */
    function as_numeric(obj) {
        return AsNumeric(obj)(obj);
    }
    DataExtensions.as_numeric = as_numeric;
    /**
     * 因为在js之中没有类型信息，所以如果要取得类型信息必须要有一个目标对象实例
     * 所以在这里，函数会需要一个实例对象来取得类型值
    */
    function AsNumeric(obj) {
        if (obj == null || obj == undefined) {
            return null;
        }
        if (typeof obj === 'number') {
            return function (x) { return x; };
        }
        else if (typeof obj === 'boolean') {
            return function (x) {
                if (x == true) {
                    return 1;
                }
                else {
                    return -1;
                }
            };
        }
        else if (typeof obj == 'undefined') {
            return function (x) { return 0; };
        }
        else if (typeof obj == 'string') {
            return function (x) {
                return Strings.Val(x);
            };
        }
        else {
            // 其他的所有情况都转换为零
            return function (x) { return 0; };
        }
    }
    DataExtensions.AsNumeric = AsNumeric;
    /**
     * @param fill 进行向量填充的初始值，可能不适用于引用类型，推荐应用于初始的基元类型
    */
    function Dim(len, fill) {
        if (fill === void 0) { fill = null; }
        var vector = [];
        for (var i = 0; i < len; i++) {
            vector.push(fill);
        }
        return vector;
    }
    DataExtensions.Dim = Dim;
})(DataExtensions || (DataExtensions = {}));
/**
 * 描述了一个键值对集合
*/
var MapTuple = /** @class */ (function () {
    /**
     * 创建一个新的键值对集合
     *
    */
    function MapTuple(key, value) {
        if (key === void 0) { key = null; }
        if (value === void 0) { value = null; }
        this.key = key;
        this.value = value;
    }
    MapTuple.prototype.valueOf = function () {
        return this.value;
    };
    MapTuple.prototype.ToArray = function () {
        return [this.key, this.value];
    };
    MapTuple.prototype.toString = function () {
        return "[" + this.key.toString() + ", " + this.value.toString() + "]";
    };
    return MapTuple;
}());
/**
 * 描述了一个带有名字属性的变量值
*/
var NamedValue = /** @class */ (function () {
    function NamedValue(name, val) {
        if (name === void 0) { name = null; }
        if (val === void 0) { val = null; }
        this.name = name;
        this.value = val;
    }
    Object.defineProperty(NamedValue.prototype, "TypeOfValue", {
        /**
         * 获取得到变量值的类型定义信息
        */
        get: function () {
            return TypeInfo.typeof(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NamedValue.prototype, "IsEmpty", {
        /**
         * 这个之对象是否是空的？
        */
        get: function () {
            return Strings.Empty(this.name) && (!this.value || this.value == undefined);
        },
        enumerable: true,
        configurable: true
    });
    NamedValue.prototype.valueOf = function () {
        return this.value;
    };
    NamedValue.prototype.ToArray = function () {
        return [this.name, this.value];
    };
    NamedValue.prototype.toString = function () {
        return this.name;
    };
    return NamedValue;
}());
/// <reference path="../Collections/Map.ts" />
/**
 * TypeScript string helpers.
 * (这个模块之中的大部分的字符串处理函数的行为是和VisualBasic之中的字符串函数的行为是相似的)
*/
var Strings;
(function (Strings) {
    Strings.x0 = "0".charCodeAt(0);
    Strings.x9 = "9".charCodeAt(0);
    Strings.asterisk = "*".charCodeAt(0);
    Strings.cr = "\c".charCodeAt(0);
    Strings.lf = "\r".charCodeAt(0);
    Strings.a = "a".charCodeAt(0);
    Strings.z = "z".charCodeAt(0);
    Strings.A = "A".charCodeAt(0);
    Strings.Z = "Z".charCodeAt(0);
    Strings.numericPattern = /[-]?\d+(\.\d+)?/g;
    /**
     * 判断所给定的字符串文本是否是任意实数的正则表达式模式
    */
    function isNumericPattern(text) {
        return IsPattern(text, Strings.numericPattern);
    }
    Strings.isNumericPattern = isNumericPattern;
    /**
     * 对bytes数值进行格式自动优化显示
     *
     * @param bytes
     *
     * @return 经过自动格式优化过后的大小显示字符串
    */
    function Lanudry(bytes) {
        var symbols = ["B", "KB", "MB", "GB", "TB"];
        var exp = Math.floor(Math.log(bytes) / Math.log(1000));
        var symbol = symbols[exp];
        var val = (bytes / Math.pow(1000, Math.floor(exp)));
        return Strings.sprintf("%.2f " + symbol, val);
    }
    Strings.Lanudry = Lanudry;
    /**
     * how to escape xml entities in javascript?
     *
     * > https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
    */
    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }
    Strings.escapeXml = escapeXml;
    /**
     * 这个函数会将字符串起始的数字给匹配出来
     * 如果匹配失败会返回零
     *
     * 与VB之中的val函数的行为相似，但是这个函数返回整形数
     *
     * @param text 这个函数并没有执行trim操作，所以如果字符串的起始为空白符的话
     *     会导致解析结果为零
    */
    function parseInt(text) {
        var number;
        var c;
        var ascii;
        if (Strings.Empty(text, true)) {
            return 0;
        }
        else {
            number = [];
        }
        for (var i = 0; i < text.length; i++) {
            c = text.charAt(i);
            ascii = c.charCodeAt(0);
            if (ascii >= Strings.x0 && ascii <= Strings.x9) {
                number.push(c);
            }
            else {
                break;
            }
        }
        if (number.length == 0) {
            return 0;
        }
        else {
            return Number(number.join(""));
        }
    }
    Strings.parseInt = parseInt;
    /**
     * Create new string value by repeats a given char n times.
     *
     * @param c A single char
     * @param n n chars
    */
    function New(c, n) {
        if (n == 0) {
            return "";
        }
        else if (n == 1) {
            return c;
        }
        else {
            var s = "";
            for (var i = 1; i < n; ++i) {
                s = s + c;
            }
            return s;
        }
    }
    Strings.New = New;
    /**
     * Round the number value or number text in given decimals.
     *
     * @param decimals 默认是保留3位有效数字的
    */
    function round(x, decimals) {
        if (decimals === void 0) { decimals = 3; }
        var floatX = typeof x == "number" ? x : parseFloat(x);
        var n = Math.pow(10, decimals);
        if (isNaN(floatX)) {
            if (TypeScript.logging.outputWarning) {
                console.warn("Invalid number value: '" + x + "'");
            }
            return false;
        }
        else {
            return Math.round(floatX * n) / n;
        }
    }
    Strings.round = round;
    /**
     * 判断当前的这个字符是否是一个数字？
     *
     * @param c A single character, length = 1
    */
    function isNumber(c) {
        var code = c.charCodeAt(0);
        return code >= Strings.x0 && code <= Strings.x9;
    }
    Strings.isNumber = isNumber;
    /**
     * 判断当前的这个字符是否是一个字母？
     *
     * @param c A single character, length = 1
    */
    function isAlphabet(c) {
        var code = c.charCodeAt(0);
        return (code >= Strings.a && code <= Strings.z) || (code >= Strings.A && code <= Strings.Z);
    }
    Strings.isAlphabet = isAlphabet;
    /**
     * 将字符串转换为一个实数
     * 这个函数是直接使用parseFloat函数来工作的，如果不是符合格式的字符串，则可能会返回NaN
    */
    function Val(str) {
        if (str == null || str == '' || str == undefined || str == "undefined") {
            // 将空字符串转换为零
            return 0;
        }
        else if (str == "NA" || str == "NaN") {
            return Number.NaN;
        }
        else if (str == "Inf") {
            return Number.POSITIVE_INFINITY;
        }
        else if (str == "-Inf") {
            return Number.NEGATIVE_INFINITY;
        }
        else {
            return parseFloat(str);
        }
    }
    Strings.Val = Val;
    /**
     * 将文本字符串按照newline进行分割
    */
    function lineTokens(text) {
        return (!text) ? [] : text.trim().split("\n");
    }
    Strings.lineTokens = lineTokens;
    /**
     * 如果不存在``tag``分隔符，则返回来的``tuple``里面，``name``是输入的字符串，``value``则是空字符串
     *
     * @param tag 分割name和value的分隔符，默认是一个空白符号
    */
    function GetTagValue(str, tag) {
        if (tag === void 0) { tag = " "; }
        if (!str) {
            return new NamedValue();
        }
        else {
            return tagValueImpl(str, tag);
        }
    }
    Strings.GetTagValue = GetTagValue;
    function tagValueImpl(str, tag) {
        var i = str.indexOf(tag);
        var tagLen = Len(tag);
        if (i > -1) {
            var name = str.substr(0, i);
            var value = str.substr(i + tagLen);
            return new NamedValue(name, value);
        }
        else {
            return new NamedValue(str, "");
        }
    }
    /**
     * 取出大文本之中指定的前n行文本
    */
    function PeekLines(text, n) {
        var p = 0;
        var out = [];
        for (var i = 0; i < n; i++) {
            var pn = text.indexOf("\n", p);
            if (pn > -1) {
                out.push(text.substr(p, pn - p));
                p = pn;
            }
            else {
                // 已经到头了
                break;
            }
        }
        return out;
    }
    Strings.PeekLines = PeekLines;
    /**
     * Get all regex pattern matches in target text value.
    */
    function getAllMatches(text, pattern) {
        var match = null;
        var out = [];
        if (typeof pattern == "string") {
            pattern = new RegExp(pattern);
        }
        if (pattern.global) {
            while (match = pattern.exec(text)) {
                out.push(match);
            }
        }
        else {
            if (match = pattern.exec(text)) {
                out.push(match);
            }
        }
        return out;
    }
    Strings.getAllMatches = getAllMatches;
    /**
     * Removes the given chars from the begining of the given
     * string and the end of the given string.
     *
     * @param chars A collection of characters that will be trimmed.
     *    (如果这个参数为空值，则会直接使用字符串对象自带的trim函数来完成工作)
     *
     * @returns 这个函数总是会确保返回来的值不是空值，如果输入的字符串参数为空值，则会直接返回零长度的空字符串
    */
    function Trim(str, chars) {
        if (chars === void 0) { chars = null; }
        if (Strings.Empty(str, false)) {
            return "";
        }
        else if (isNullOrUndefined(chars)) {
            return str.trim();
        }
        if (typeof chars == "string") {
            chars = From(Strings.ToCharArray(chars))
                .Select(function (c) { return c.charCodeAt(0); })
                .ToArray(false);
        }
        return function (chars) {
            return From(Strings.ToCharArray(str))
                .SkipWhile(function (c) { return chars.indexOf(c.charCodeAt(0)) > -1; })
                .Reverse()
                .SkipWhile(function (c) { return chars.indexOf(c.charCodeAt(0)) > -1; })
                .Reverse()
                .JoinBy("");
        }(chars);
    }
    Strings.Trim = Trim;
    function LTrim(str, chars) {
        if (chars === void 0) { chars = " "; }
        if (Strings.Empty(str, false)) {
            return "";
        }
        if (typeof chars == "string") {
            chars = From(Strings.ToCharArray(chars))
                .Select(function (c) { return c.charCodeAt(0); })
                .ToArray(false);
        }
        return function (chars) {
            return From(Strings.ToCharArray(str))
                .SkipWhile(function (c) { return chars.indexOf(c.charCodeAt(0)) > -1; })
                .JoinBy("");
        }(chars);
    }
    Strings.LTrim = LTrim;
    function RTrim(str, chars) {
        if (chars === void 0) { chars = " "; }
        if (Strings.Empty(str, false)) {
            return "";
        }
        if (typeof chars == "string") {
            chars = From(Strings.ToCharArray(chars))
                .Select(function (c) { return c.charCodeAt(0); })
                .ToArray(false);
        }
        var strChars = Strings.ToCharArray(str);
        var lefts = 0;
        for (var i = strChars.length - 1; i > 0; i--) {
            if (chars.indexOf(strChars[i].charCodeAt(0)) == -1) {
                lefts = i;
                break;
            }
        }
        if (lefts == 0) {
            return "";
        }
        else {
            return str.substr(0, lefts + 1);
        }
    }
    Strings.RTrim = RTrim;
    /**
     * Determine that the given string is empty string or not?
     * (判断给定的字符串是否是空值？)
     *
     * @param stringAsFactor 假若这个参数为真的话，那么字符串``undefined``或者``NULL``以及``null``也将会被当作为空值处理
    */
    function Empty(str, stringAsFactor) {
        if (stringAsFactor === void 0) { stringAsFactor = false; }
        if (!str) {
            return true;
        }
        else if (str == undefined || typeof str == "undefined") {
            return true;
        }
        else if (str.length == 0) {
            return true;
        }
        else if (stringAsFactor && (str == "undefined" || str == "null" || str == "NULL")) {
            return true;
        }
        else {
            return false;
        }
    }
    Strings.Empty = Empty;
    /**
     * 测试字符串是否是空白集合
     *
     * @param stringAsFactor 如果这个参数为真，则``\t``和``\s``等也会被当作为空白
    */
    function Blank(str, stringAsFactor) {
        if (stringAsFactor === void 0) { stringAsFactor = false; }
        if (!str || IsPattern(str, /\s+/g)) {
            return true;
        }
        else if (str == undefined || typeof str == "undefined") {
            return true;
        }
        else if (str.length == 0) {
            return true;
        }
        else if (stringAsFactor && (str == "\\s" || str == "\\t")) {
            return true;
        }
        else {
            return false;
        }
    }
    Strings.Blank = Blank;
    /**
     * Determine that the whole given string is match a given regex pattern.
    */
    function IsPattern(str, pattern) {
        if (!str) {
            // 字符串是空的，则肯定不满足
            return false;
        }
        var matches = str.match(ensureRegexp(pattern));
        if (isNullOrUndefined(matches)) {
            return false;
        }
        else {
            var match = matches[0];
            var test = match == str;
            return test;
        }
    }
    Strings.IsPattern = IsPattern;
    function ensureRegexp(pattern) {
        if (typeof pattern == "string") {
            return new RegExp(pattern);
        }
        else {
            return pattern;
        }
    }
    /**
     * Remove duplicate string values from JS array
     *
     * https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    */
    function Unique(a) {
        var seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
    Strings.Unique = Unique;
    /**
     * 将字符串转换为字符数组
     *
     * @description > https://jsperf.com/convert-string-to-char-code-array/9
     *    经过测试，使用数组push的效率最高
     *
     * @param charCode 返回来的数组是否应该是一组字符的ASCII值而非字符本身？默认是返回字符数组的。
     *
     * @returns A character array, all of the string element in the array
     *      is one character length.
    */
    function ToCharArray(str, charCode) {
        if (charCode === void 0) { charCode = false; }
        var cc = [];
        var strLen = str.length;
        if (charCode) {
            for (var i = 0; i < strLen; ++i) {
                cc.push(str.charCodeAt(i));
            }
        }
        else {
            for (var i = 0; i < strLen; ++i) {
                cc.push(str.charAt(i));
            }
        }
        return cc;
    }
    Strings.ToCharArray = ToCharArray;
    /**
     * Measure the string length, a null string value or ``undefined``
     * variable will be measured as ZERO length.
    */
    function Len(s) {
        if (!s || s == undefined) {
            return 0;
        }
        else {
            return s.length;
        }
    }
    Strings.Len = Len;
    /**
     * 比较两个字符串的大小，可以同于字符串的分组操作
    */
    function CompareTo(s1, s2) {
        var l1 = Strings.Len(s1);
        var l2 = Strings.Len(s2);
        var minl = Math.min(l1, l2);
        for (var i = 0; i < minl; i++) {
            var x = s1.charCodeAt(i);
            var y = s2.charCodeAt(i);
            if (x > y) {
                return 1;
            }
            else if (x < y) {
                return -1;
            }
        }
        if (l1 > l2) {
            return 1;
        }
        else if (l1 < l2) {
            return -1;
        }
        else {
            return 0;
        }
    }
    Strings.CompareTo = CompareTo;
    Strings.sprintf = data.sprintf.doFormat;
    /**
     * @param charsPerLine 每一行文本之中的字符数量的最大值
    */
    function WrappingLines(text, charsPerLine) {
        if (charsPerLine === void 0) { charsPerLine = 200; }
        var sb = "";
        var lines = Strings.lineTokens(text);
        var p;
        for (var i = 0; i < lines.length; i++) {
            var line = Strings.Trim(lines[i]);
            if (line.length < charsPerLine) {
                sb = sb + line + "\n";
            }
            else {
                p = 0;
                while (true) {
                    sb = sb + line.substr(p, charsPerLine) + "\n";
                    p += charsPerLine;
                    if ((p + charsPerLine) > line.length) {
                        // 下一个起始的位置已经超过文本行的长度了
                        // 则是终止的时候了
                        sb = sb + line.substr(p) + "\n";
                        break;
                    }
                }
            }
        }
        return sb;
    }
    Strings.WrappingLines = WrappingLines;
})(Strings || (Strings = {}));
/**
 * 类似于反射类型
*/
var TypeInfo = /** @class */ (function () {
    function TypeInfo() {
    }
    Object.defineProperty(TypeInfo.prototype, "IsPrimitive", {
        /**
         * 是否是js之中的基础类型？
        */
        get: function () {
            return !this.class;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeInfo.prototype, "IsArray", {
        /**
         * 是否是一个数组集合对象？
        */
        get: function () {
            return this.typeOf == "array";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeInfo.prototype, "IsEnumerator", {
        /**
         * 是否是一个枚举器集合对象？
        */
        get: function () {
            return this.typeOf == "object" && this.class == "IEnumerator";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 当前的对象是某种类型的数组集合对象
    */
    TypeInfo.prototype.IsArrayOf = function (genericType) {
        return this.IsArray && this.class == genericType;
    };
    /**
     * 获取得到类型名称
    */
    TypeInfo.getClass = function (obj) {
        var type = typeof obj;
        var isObject = type == "object";
        var isArray = Array.isArray(obj);
        var isNull = isNullOrUndefined(obj);
        return TypeInfo.getClassInternal(obj, isArray, isObject, isNull);
    };
    TypeInfo.getClassInternal = function (obj, isArray, isObject, isNull) {
        if (isArray) {
            var x = obj[0];
            var className;
            if ((className = typeof x) == "object") {
                className = x.constructor.name;
            }
            else {
                // do nothing
            }
            return className;
        }
        else if (isObject) {
            if (isNull) {
                if (TypeScript.logging.outputWarning) {
                    console.warn(TypeExtensions.objectIsNothing);
                }
                return "null";
            }
            else {
                return obj.constructor.name;
            }
        }
        else {
            return "";
        }
    };
    /**
     * 获取某一个对象的类型信息
    */
    TypeInfo.typeof = function (obj) {
        var type = typeof obj;
        var isObject = type == "object";
        var isArray = Array.isArray(obj);
        var isNull = isNullOrUndefined(obj);
        var typeInfo = new TypeInfo;
        var className = TypeInfo.getClassInternal(obj, isArray, isObject, isNull);
        typeInfo.typeOf = isArray ? "array" : type;
        typeInfo.class = className;
        if (isNull) {
            typeInfo.property = [];
            typeInfo.methods = [];
        }
        else {
            typeInfo.property = isObject ? Object.keys(obj) : [];
            typeInfo.methods = TypeInfo.GetObjectMethods(obj);
        }
        return typeInfo;
    };
    /**
     * 获取object对象上所定义的所有的函数
    */
    TypeInfo.GetObjectMethods = function (obj) {
        var res = [];
        for (var m in obj) {
            if (typeof obj[m] == "function") {
                res.push(m);
            }
        }
        return res;
    };
    TypeInfo.prototype.toString = function () {
        if (this.typeOf == "object") {
            return "<" + this.typeOf + "> " + this.class;
        }
        else {
            return this.typeOf;
        }
    };
    /**
     * 利用一个名称字符串集合创建一个js对象
     *
     * @param names object的属性名称列表
     * @param init 使用这个函数为该属性指定一个初始值
    */
    TypeInfo.EmptyObject = function (names, init) {
        if (init === void 0) { init = null; }
        var obj = {};
        if (typeof init == "function") {
            // 通过函数来进行初始化，则每一个属性值可能会不一样
            // 例如使用随机数函数来初始化
            var create_1 = init;
            if (Array.isArray(names)) {
                names.forEach(function (name) { return obj[name] = create_1(); });
            }
            else {
                names.ForEach(function (name) { return obj[name] = create_1(); });
            }
        }
        else {
            // 直接是一个值的时候，则所有的属性值都是一样的          
            if (Array.isArray(names)) {
                names.forEach(function (name) { return obj[name] = init; });
            }
            else {
                names.ForEach(function (name) { return obj[name] = init; });
            }
        }
        return obj;
    };
    /**
     * 从键值对集合创建object对象，键名或者名称属性会作为object对象的属性名称
    */
    TypeInfo.CreateObject = function (nameValues) {
        var obj = {};
        var type = TypeInfo.typeof(nameValues);
        if (type.IsArray && type.class == "MapTuple") {
            nameValues.forEach(function (map) { return obj[map.key] = map.value; });
        }
        else if (type.IsArray && type.class == "NamedValue") {
            nameValues.forEach(function (nv) { return obj[nv.name] = nv.value; });
        }
        else if (type.class == "IEnumerator") {
            var seq = nameValues;
            type = seq.ElementType;
            if (type.class == "MapTuple") {
                nameValues
                    .ForEach(function (map) {
                    obj[map.key] = map.value;
                });
            }
            else if (type.class == "NamedValue") {
                nameValues
                    .ForEach(function (nv) {
                    obj[nv.name] = nv.value;
                });
            }
            else {
                console.error(type);
                throw "Unsupport data type: " + type.class;
            }
        }
        else {
            throw "Unsupport data type: " + JSON.stringify(type);
        }
        return obj;
    };
    /**
     * MetaReader对象和字典相似，只不过是没有类型约束，并且为只读集合
    */
    TypeInfo.CreateMetaReader = function (nameValues) {
        return new TsLinq.MetaReader(TypeInfo.CreateObject(nameValues));
    };
    return TypeInfo;
}());
/**
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
*/
var MD5;
(function (MD5) {
    // jslint bitwise: true
    // global unescape, define
    /**
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    MD5.safe_add = safe_add;
    /**
     * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    MD5.bit_rol = bit_rol;
    //#region "These functions implement the four basic operations the algorithm uses."
    function md5_cmn(q, a, b, x, s, t) {
        return MD5.safe_add(MD5.bit_rol(MD5.safe_add(MD5.safe_add(a, q), MD5.safe_add(x, t)), s), b);
    }
    MD5.md5_cmn = md5_cmn;
    function md5_ff(a, b, c, d, x, s, t) {
        return MD5.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    MD5.md5_ff = md5_ff;
    function md5_gg(a, b, c, d, x, s, t) {
        return MD5.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    MD5.md5_gg = md5_gg;
    function md5_hh(a, b, c, d, x, s, t) {
        return MD5.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    MD5.md5_hh = md5_hh;
    function md5_ii(a, b, c, d, x, s, t) {
        return MD5.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    MD5.md5_ii = md5_ii;
    //#endregion
    /**
     * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        var olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        // append padding
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        for (var i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = MD5.md5_ff(a, b, c, d, x[i], 7, -680876936);
            d = MD5.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = MD5.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = MD5.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = MD5.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = MD5.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = MD5.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = MD5.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = MD5.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = MD5.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = MD5.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = MD5.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = MD5.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = MD5.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = MD5.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = MD5.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = MD5.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = MD5.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = MD5.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = MD5.md5_gg(b, c, d, a, x[i], 20, -373897302);
            a = MD5.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = MD5.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = MD5.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = MD5.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = MD5.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = MD5.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = MD5.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = MD5.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = MD5.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = MD5.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = MD5.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = MD5.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = MD5.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = MD5.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = MD5.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = MD5.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = MD5.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = MD5.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = MD5.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = MD5.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = MD5.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = MD5.md5_hh(d, a, b, c, x[i], 11, -358537222);
            c = MD5.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = MD5.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = MD5.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = MD5.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = MD5.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = MD5.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = MD5.md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = MD5.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = MD5.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = MD5.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = MD5.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = MD5.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = MD5.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = MD5.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = MD5.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = MD5.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = MD5.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = MD5.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = MD5.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = MD5.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = MD5.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = MD5.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = MD5.safe_add(a, olda);
            b = MD5.safe_add(b, oldb);
            c = MD5.safe_add(c, oldc);
            d = MD5.safe_add(d, oldd);
        }
        return [a, b, c, d];
    }
    MD5.binl_md5 = binl_md5;
    /**
     * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var output = '';
        for (var i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }
    MD5.binl2rstr = binl2rstr;
    /**
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (var i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (var i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }
    MD5.rstr2binl = rstr2binl;
    /**
     * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return MD5.binl2rstr(MD5.binl_md5(MD5.rstr2binl(s), s.length * 8));
    }
    MD5.rstr_md5 = rstr_md5;
    /**
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var bkey = MD5.rstr2binl(key), ipad = [], opad = [];
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = MD5.binl_md5(bkey, key.length * 8);
        }
        for (var i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash;
        hash = ipad.concat(MD5.rstr2binl(data));
        hash = MD5.binl_md5(hash, 512 + data.length * 8);
        hash = opad.concat(hash);
        hash = MD5.binl_md5(hash, 512 + 128);
        return MD5.binl2rstr(hash);
    }
    MD5.rstr_hmac_md5 = rstr_hmac_md5;
    var hex_tab = '0123456789abcdef';
    /**
     * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var output = '', x;
        for (var i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }
    MD5.rstr2hex = rstr2hex;
    /**
     * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }
    MD5.str2rstr_utf8 = str2rstr_utf8;
    /**
     * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return MD5.rstr_md5(MD5.str2rstr_utf8(s));
    }
    MD5.raw_md5 = raw_md5;
    function hex_md5(s) {
        return MD5.rstr2hex(MD5.raw_md5(s));
    }
    MD5.hex_md5 = hex_md5;
    function raw_hmac_md5(k, d) {
        return MD5.rstr_hmac_md5(MD5.str2rstr_utf8(k), MD5.str2rstr_utf8(d));
    }
    MD5.raw_hmac_md5 = raw_hmac_md5;
    function hex_hmac_md5(k, d) {
        return MD5.rstr2hex(MD5.raw_hmac_md5(k, d));
    }
    MD5.hex_hmac_md5 = hex_hmac_md5;
    /**
     * 利用这个函数来进行字符串的MD5值的计算操作
    */
    function calculate(string, key, raw) {
        if (key === void 0) { key = null; }
        if (raw === void 0) { raw = null; }
        if (!key) {
            if (!raw) {
                return MD5.hex_md5(string);
            }
            return MD5.raw_md5(string);
        }
        if (!raw) {
            return MD5.hex_hmac_md5(key, string);
        }
        return MD5.raw_hmac_md5(key, string);
    }
    MD5.calculate = calculate;
})(MD5 || (MD5 = {}));
/// <reference path="../../Collections/Abstract/Enumerator.ts" />
var TsLinq;
(function (TsLinq) {
    /**
     * 程序的堆栈追踪信息
     *
     * 这个对象是调用堆栈``StackFrame``片段对象的序列集合
    */
    var StackTrace = /** @class */ (function (_super) {
        __extends(StackTrace, _super);
        function StackTrace(frames) {
            return _super.call(this, frames) || this;
        }
        /**
         * 导出当前的程序运行位置的调用堆栈信息
        */
        StackTrace.Dump = function () {
            var err = new Error().stack.split("\n");
            var trace = From(err)
                //   1 是第一行 err 字符串, 
                // + 1 是跳过当前的这个Dump函数的栈信息
                .Skip(1 + 1)
                .Select(TsLinq.StackFrame.Parse);
            return new StackTrace(trace);
        };
        /**
         * 获取函数调用者的名称的帮助函数
        */
        StackTrace.GetCallerMember = function () {
            var trace = StackTrace.Dump().ToArray();
            // index = 1 是GetCallerMemberName这个函数的caller的栈片段
            // index = 2 就是caller的caller的栈片段，即该caller的CallerMemberName
            var caller = trace[1 + 1];
            return caller;
        };
        StackTrace.prototype.toString = function () {
            var sb = new StringBuilder();
            this.ForEach(function (frame) {
                sb.AppendLine("  at " + frame.toString());
            });
            return sb.toString();
        };
        return StackTrace;
    }(IEnumerator));
    TsLinq.StackTrace = StackTrace;
})(TsLinq || (TsLinq = {}));
/// <reference path="./Abstract/Enumerator.ts" />
/// <reference path="../Data/StackTrace/StackTrace.ts" />
/**
 * 键值对映射哈希表
 *
 * ```
 * IEnumerator<MapTuple<string, V>>
 * ```
*/
var Dictionary = /** @class */ (function (_super) {
    __extends(Dictionary, _super);
    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    function Dictionary(maps) {
        if (maps === void 0) { maps = null; }
        var _this = _super.call(this, Dictionary.ObjectMaps(maps)) || this;
        if (isNullOrUndefined(maps)) {
            _this.maps = {};
        }
        else if (Array.isArray(maps)) {
            _this.maps = TypeInfo.CreateObject(maps);
        }
        else if (TypeInfo.typeof(maps).class == "IEnumerator") {
            _this.maps = TypeInfo.CreateObject(maps);
        }
        else {
            _this.maps = maps;
        }
        return _this;
    }
    Object.defineProperty(Dictionary.prototype, "Object", {
        /**
         * 返回一个被复制的当前的map对象
        */
        get: function () {
            return Framework.Extensions.extend(this.maps);
        },
        enumerable: true,
        configurable: true
    });
    ///**
    // * 可以使用``for (var [key, value] of Maps) {}``的语法来进行迭代
    //*/
    //public get Maps(): Map {        
    //    var maps: Map = new Map();
    //    // 将内部的object转换为可以被迭代的ES6的Map对象
    //    Object.keys(this.maps)
    //        .forEach(key => maps.set(key, this.maps[key]));
    //    return maps;
    //}
    /**
     * 如果键名称是空值的话，那么这个函数会自动使用caller的函数名称作为键名进行值的获取
     *
     * https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
     *
     * @param key 键名或者序列的索引号
    */
    Dictionary.prototype.Item = function (key) {
        if (key === void 0) { key = null; }
        if (!key) {
            key = TsLinq.StackTrace.GetCallerMember().memberName;
        }
        if (typeof key == "string") {
            return (this.maps[key]);
        }
        else {
            return this.sequence[key].value;
        }
    };
    Object.defineProperty(Dictionary.prototype, "Keys", {
        /**
         * 获取这个字典对象之中的所有的键名
        */
        get: function () {
            return From(Object.keys(this.maps));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "Values", {
        /**
         * 获取这个字典对象之中的所有的键值
        */
        get: function () {
            return this.Select(function (m) { return m.value; });
        },
        enumerable: true,
        configurable: true
    });
    Dictionary.FromMaps = function (maps) {
        return new Dictionary(maps);
    };
    Dictionary.FromNamedValues = function (values) {
        return new Dictionary(TypeInfo.CreateObject(values));
    };
    Dictionary.MapSequence = function (maps) {
        return new IEnumerator(this.ObjectMaps(maps));
    };
    /**
     * 将目标对象转换为一个类型约束的映射序列集合
    */
    Dictionary.ObjectMaps = function (maps) {
        var type = TypeInfo.typeof(maps);
        if (isNullOrUndefined(maps)) {
            return [];
        }
        if (Array.isArray(maps)) {
            return maps;
        }
        else if (type.class == "IEnumerator") {
            return maps.ToArray();
        }
        else {
            return From(Object.keys(maps))
                .Select(function (key) { return new MapTuple(key, maps[key]); })
                .ToArray();
        }
    };
    /**
     * 查看这个字典集合之中是否存在所给定的键名
    */
    Dictionary.prototype.ContainsKey = function (key) {
        return key in this.maps;
    };
    /**
     * 向这个字典对象之中添加一个键值对，请注意，如果key已经存在这个字典对象中了，这个函数会自动覆盖掉key所对应的原来的值
    */
    Dictionary.prototype.Add = function (key, value) {
        this.maps[key] = value;
        this.sequence = Dictionary.ObjectMaps(this.maps);
        return this;
    };
    /**
     * 删除一个给定键名所指定的键值对
    */
    Dictionary.prototype.Delete = function (key) {
        if (key in this.maps) {
            delete this.maps[key];
            this.sequence = Dictionary.ObjectMaps(this.maps);
        }
        return this;
    };
    return Dictionary;
}(IEnumerator));
/// <reference path="./sprintf.ts" />
/// <reference path="../../Collections/DictionaryMaps.ts" />
var TypeScript;
(function (TypeScript) {
    var URLPatterns;
    (function (URLPatterns) {
        URLPatterns.hostNamePattern = /:\/\/(www[0-9]?\.)?(.[^/:]+)/i;
        /**
         * Regexp pattern for data uri string
        */
        URLPatterns.uriPattern = /data[:]\S+[/]\S+;base64,[a-zA-Z0-9/=+]/ig;
        /**
         * Regexp pattern for web browser url string
        */
        URLPatterns.urlPattern = /((https?)|(ftp))[:]\/{2}\S+\.[a-z]+[^ >"]*/ig;
    })(URLPatterns = TypeScript.URLPatterns || (TypeScript.URLPatterns = {}));
    /**
     * URL组成字符串解析模块
    */
    var URL = /** @class */ (function () {
        /**
         * 在这里解析一个URL字符串
        */
        function URL(url) {
            // http://localhost/router.html#http://localhost/b.html
            var token = Strings.GetTagValue(url, "://");
            this.protocol = token.name;
            token = Strings.GetTagValue(token.value, "/");
            this.origin = token.name;
            token = Strings.GetTagValue(token.value, "?");
            this.path = token.name;
            this.fileName = Strings.Empty(this.path) ? "" : TsLinq.PathHelper.basename(this.path);
            this.hash = From(url.split("#")).Last;
            if (url.indexOf("#") < 0) {
                this.hash = "";
            }
            var args = URL.UrlQuery(token.value);
            this.queryArguments = Dictionary
                .MapSequence(args)
                .Select(function (m) { return new NamedValue(m.key, m.value); });
        }
        Object.defineProperty(URL.prototype, "query", {
            /**
             * URL查询参数
            */
            get: function () {
                return this.queryArguments.ToArray(false);
            },
            enumerable: true,
            configurable: true
        });
        ;
        URL.prototype.getArgument = function (queryName, caseSensitive, Default) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (Default === void 0) { Default = ""; }
            if (Strings.Empty(queryName, false)) {
                return "";
            }
            else if (!caseSensitive) {
                queryName = queryName.toLowerCase();
            }
            return this.queryArguments
                .Where(function (map) { return caseSensitive ? map.name == queryName : map.name.toLowerCase() == queryName; })
                .FirstOrDefault({ value: Default })
                .value;
        };
        /**
         * 将URL之中的query部分解析为字典对象
        */
        URL.UrlQuery = function (args) {
            if (args) {
                return DataExtensions.parseQueryString(args, false);
            }
            else {
                return {};
            }
        };
        /**
         * 跳转到url之中的hash编号的文档位置处
         *
         * @param hash ``#xxx``文档节点编号表达式
        */
        URL.JumpToHash = function (hash) {
            // Getting Y of target element
            // Go there directly or some transition
            window.scrollTo(0, $ts(hash).offsetTop);
        };
        /**
         * Set url hash without url jump in document
        */
        URL.SetHash = function (hash) {
            if (history.pushState) {
                history.pushState(null, null, hash);
            }
            else {
                location.hash = hash;
            }
        };
        /**
         * 获取得到当前的url
        */
        URL.WindowLocation = function () {
            return new URL(window.location.href);
        };
        URL.prototype.toString = function () {
            var query = From(this.query)
                .Select(function (q) { return q.name + "=" + encodeURIComponent(q.value); })
                .JoinBy("&");
            var url = this.protocol + "://" + this.origin + "/" + this.path;
            if (query) {
                url = url + "?" + query;
            }
            if (this.hash) {
                url = url + "#" + this.hash;
            }
            return url;
        };
        URL.Refresh = function (url) {
            return url + "&refresh=" + Math.random() * 10000;
        };
        /**
         * 获取所给定的URL之中的host名称字符串，如果解析失败会返回空值
        */
        URL.getHostName = function (url) {
            var match = url.match(URLPatterns.hostNamePattern);
            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                return match[2];
            }
            else {
                return null;
            }
        };
        /**
         * 将目标文本之中的所有的url字符串匹配出来
        */
        URL.ParseAllUrlStrings = function (text) {
            var urls = [];
            for (var _i = 0, _a = Strings.getAllMatches(text, URLPatterns.urlPattern); _i < _a.length; _i++) {
                var url = _a[_i];
                urls.push(url[0]);
            }
            return urls;
        };
        URL.IsWellFormedUriString = function (uri) {
            var matches = uri.match(URLPatterns.uriPattern);
            if (isNullOrUndefined(matches)) {
                return false;
            }
            var match = matches[0];
            if (!Strings.Empty(match, true)) {
                return uri.indexOf(match) == 0;
            }
            else {
                return false;
            }
        };
        return URL;
    }());
    TypeScript.URL = URL;
})(TypeScript || (TypeScript = {}));
var TsLinq;
(function (TsLinq) {
    /**
     * String helpers for the file path string.
    */
    var PathHelper;
    (function (PathHelper) {
        /**
         * 只保留文件名（已经去除了文件夹路径以及文件名最后的拓展名部分）
        */
        function basename(fileName) {
            var nameTokens = From(Strings.RTrim(fileName, "/").split("/")).Last.split(".");
            if (nameTokens.length == 1) {
                return nameTokens[0];
            }
            var name = new IEnumerator(nameTokens)
                .Take(nameTokens.length - 1)
                .JoinBy(".");
            return name;
        }
        PathHelper.basename = basename;
        function extensionName(fileName) {
            var nameTokens = From(Strings.RTrim(fileName, "/").split("/")).Last.split(".");
            if (nameTokens.length == 1) {
                // 没有拓展名
                return "";
            }
            else {
                return nameTokens[nameTokens.length - 1];
            }
        }
        PathHelper.extensionName = extensionName;
        /**
         * 函数返回文件名或者文件夹的名称
        */
        function fileName(path) {
            return From(Strings.RTrim(path, "/").split("/")).Last;
        }
        PathHelper.fileName = fileName;
    })(PathHelper = TsLinq.PathHelper || (TsLinq.PathHelper = {}));
})(TsLinq || (TsLinq = {}));
/**
 * 这个枚举选项的值会影响框架之中的调试器的终端输出行为
*/
var Modes;
(function (Modes) {
    /**
     * Framework debug level
     * (这个等级下会输出所有信息)
    */
    Modes[Modes["debug"] = 0] = "debug";
    /**
     * development level
     * (这个等级下会输出警告信息)
    */
    Modes[Modes["development"] = 10] = "development";
    /**
     * production level
     * (只会输出错误信息，默认等级)
    */
    Modes[Modes["production"] = 200] = "production";
})(Modes || (Modes = {}));
/**
 * HTML文档操作帮助函数
*/
var DOM;
(function (DOM) {
    /**
     * Query meta tag content value by name
     *
     * @param allowQueryParent 当当前的文档之中不存在目标meta标签的时候，
     *    如果当前文档为iframe文档，则是否允许继续往父节点的文档做查询？
     *    默认为False，即只在当前文档环境之中进行查询操作
     * @param Default 查询失败的时候所返回来的默认值
    */
    function metaValue(name, Default, allowQueryParent) {
        if (Default === void 0) { Default = null; }
        if (allowQueryParent === void 0) { allowQueryParent = false; }
        var selector = "meta[name~=\"" + name + "\"]";
        var meta = document.querySelector(selector);
        var getContent = function () {
            if (meta) {
                var content = meta.getAttribute("content");
                return content ? content : Default;
            }
            else {
                if (TypeScript.logging.outputWarning) {
                    console.warn(selector + " not found in current context!");
                }
                return Default;
            }
        };
        if (!meta && allowQueryParent) {
            meta = parent.window
                .document
                .querySelector(selector);
        }
        return getContent();
    }
    DOM.metaValue = metaValue;
    /**
     * File download helper
     *
     * @param name The file save name for download operation
     * @param uri The file object to download
    */
    function download(name, uri) {
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(DataExtensions.uriToBlob(uri), name);
        }
        else {
            downloadImpl(name, uri);
        }
    }
    DOM.download = download;
    function downloadImpl(name, uri) {
        var saveLink = $ts('<a>');
        var downloadSupported = 'download' in saveLink;
        if (downloadSupported) {
            saveLink.download = name;
            saveLink.style.display = 'none';
            document.body.appendChild(saveLink);
            try {
                var blob = DataExtensions.uriToBlob(uri);
                var url = URL.createObjectURL(blob);
                saveLink.href = url;
                saveLink.onclick = function () {
                    requestAnimationFrame(function () {
                        URL.revokeObjectURL(url);
                    });
                };
            }
            catch (e) {
                if (TypeScript.logging.outputWarning) {
                    console.warn('This browser does not support object URLs. Falling back to string URL.');
                }
                saveLink.href = uri;
            }
            saveLink.click();
            document.body.removeChild(saveLink);
        }
        else {
            window.open(uri, '_temp', 'menubar=no,toolbar=no,status=no');
        }
    }
    /**
     * 尝试获取当前的浏览器的大小
    */
    function clientSize() {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        return [x, y];
    }
    DOM.clientSize = clientSize;
    /**
     * return array containing references to selected option elements
    */
    function getSelectedOptions(sel) {
        var opts = [];
        var opt;
        // loop through options in select list
        for (var i = 0, len = sel.options.length; i < len; i++) {
            opt = sel.options[i];
            // check if selected
            if (opt.selected) {
                // add to array of option elements to return from this function
                opts.push(opt);
            }
        }
        return opts;
    }
    DOM.getSelectedOptions = getSelectedOptions;
    /**
     * 向指定id编号的div添加select标签的组件
    */
    function AddSelectOptions(items, div, selectName, className) {
        if (className === void 0) { className = ""; }
        var options = From(items)
            .Select(function (item) { return "<option value=\"" + item.value + "\">" + item.key + "</option>"; })
            .JoinBy("\n");
        var html = "\n            <select class=\"" + className + "\" multiple name=\"" + selectName + "\">\n                " + options + "\n            </select>";
        $ts("#" + div).innerHTML = html;
    }
    DOM.AddSelectOptions = AddSelectOptions;
    /**
     * @param headers 表格之中所显示的表头列表，也可以通过这个参数来对表格之中
     *   所需要进行显示的列进行筛选以及显示控制：
     *    + 如果这个参数为默认的空值，则说明显示所有的列数据
     *    + 如果这个参数不为空值，则会显示这个参数所指定的列出来
     *    + 可以通过``map [propertyName => display title]``来控制表头的标题输出
    */
    function CreateHTMLTableNode(rows, headers, attrs) {
        if (headers === void 0) { headers = null; }
        if (attrs === void 0) { attrs = null; }
        var thead = $ts("<thead>");
        var tbody = $ts("<tbody>");
        var fields;
        if (Array.isArray(rows)) {
            fields = headerMaps(headers || $ts(Object.keys(rows[0])));
        }
        else {
            fields = headerMaps(headers || $ts(Object.keys(rows.First)));
        }
        var rowHTML = function (r) {
            var tr = $ts("<tr>");
            // 在这里将会控制列的显示
            fields.forEach(function (m) { return tr.appendChild($ts("<td>").display(r[m.key])); });
            return tr;
        };
        if (Array.isArray(rows)) {
            rows.forEach(function (r) { return tbody.appendChild(rowHTML(r)); });
        }
        else {
            rows.ForEach(function (r) { return tbody.appendChild(rowHTML(r)); });
        }
        fields.forEach(function (r) { return thead.appendChild($ts("<th>").display(r.value)); });
        return $ts("<table>", attrs)
            .asExtends
            .append(thead)
            .append(tbody)
            .HTMLElement;
    }
    DOM.CreateHTMLTableNode = CreateHTMLTableNode;
    /**
     * 向给定编号的div对象之中添加一个表格对象
     *
     * @param headers 表头
     * @param div 新生成的table将会被添加在这个div之中，应该是一个带有``#``符号的节点id查询表达式
     * @param attrs ``<table>``的属性值，包括id，class等
    */
    function AddHTMLTable(rows, div, headers, attrs) {
        if (headers === void 0) { headers = null; }
        if (attrs === void 0) { attrs = null; }
        var id = div + "-table";
        if (attrs) {
            if (!attrs.id) {
                attrs.id = id;
            }
        }
        else {
            attrs = { id: id };
        }
        $ts(div).appendChild(CreateHTMLTableNode(rows, headers, attrs));
    }
    DOM.AddHTMLTable = AddHTMLTable;
    /**
     * @param headers ``[propertyName => displayTitle]``
    */
    function headerMaps(headers) {
        var type = TypeInfo.typeof(headers);
        if (type.IsArrayOf("string")) {
            return From(headers)
                .Select(function (h) { return new MapTuple(h, h); })
                .ToArray();
        }
        else if (type.IsArrayOf(TypeExtensions.DictionaryMap)) {
            return headers;
        }
        else if (type.IsEnumerator && typeof headers.First == "string") {
            return headers
                .Select(function (h) { return new MapTuple(h, h); })
                .ToArray();
        }
        else if (type.IsEnumerator && TypeInfo.getClass(headers.First) == TypeExtensions.DictionaryMap) {
            return headers.ToArray();
        }
        else {
            throw "Invalid sequence type: " + type.class;
        }
    }
    /**
     * Execute a given function when the document is ready.
     * It is called when the DOM is ready which can be prior to images and other external content is loaded.
     *
     * 可以处理多个函数作为事件，也可以通过loadComplete函数参数来指定准备完毕的状态
     * 默认的状态是interactive即只需要加载完DOM既可以开始立即执行函数
     *
     * @param fn A function that without any parameters
     * @param loadComplete + ``interactive``: The document has finished loading. We can now access the DOM elements.
     *                     + ``complete``: The page is fully loaded.
    */
    function ready(fn, loadComplete) {
        if (loadComplete === void 0) { loadComplete = ["interactive", "complete"]; }
        if (typeof fn !== 'function') {
            // Sanity check
            return;
        }
        else if (TypeScript.logging.outputEverything) {
            console.log("Add Document.ready event handler.");
            console.log("document.readyState = " + document.readyState);
        }
        // 2018-12-25 "interactive", "complete" 这两种状态都可以算作是DOM已经准备好了
        if (loadComplete.indexOf(document.readyState) > -1) {
            // If document is already loaded, run method
            return fn();
        }
        else {
            // Otherwise, wait until document is loaded
            document.addEventListener('DOMContentLoaded', fn, false);
        }
    }
    DOM.ready = ready;
    /**
     * 向一个给定的HTML元素或者HTML元素的集合之中的对象添加给定的事件
     *
     * @param el HTML节点元素或者节点元素的集合
     * @param type 事件的名称字符串
     * @param fn 对事件名称所指定的事件进行处理的工作函数，这个工作函数应该具备有一个事件对象作为函数参数
    */
    function addEvent(el, type, fn) {
        if (document.addEventListener) {
            if (el && (el.nodeName) || el === window) {
                el.addEventListener(type, fn, false);
            }
            else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        }
        else {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function () {
                    return fn.call(el, window.event);
                });
            }
            else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        }
    }
    DOM.addEvent = addEvent;
})(DOM || (DOM = {}));
var data;
(function (data_1) {
    /**
     * A numeric range model.
     * (一个数值范围)
    */
    var NumericRange = /** @class */ (function () {
        // #endregion
        // #region Constructors (1)
        /**
         * Create a new numeric range object
        */
        function NumericRange(min, max) {
            if (max === void 0) { max = null; }
            if (typeof min == "number" && (!isNullOrUndefined(max))) {
                this.min = min;
                this.max = max;
            }
            else {
                var range = min;
                this.min = range.min;
                this.max = range.max;
            }
        }
        Object.defineProperty(NumericRange.prototype, "range", {
            /**
             * ``[min, max]``
            */
            get: function () {
                return [this.min, this.max];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumericRange.prototype, "Length", {
            // #endregion
            // #region Public Accessors (1)
            /**
             * The delta length between the max and the min value.
            */
            get: function () {
                return this.max - this.min;
            },
            enumerable: true,
            configurable: true
        });
        // #endregion
        // #region Public Static Methods (1)
        /**
         * 从一个数值序列之中创建改数值序列的值范围
         *
         * @param numbers A given numeric data sequence.
        */
        NumericRange.Create = function (numbers) {
            var seq = Array.isArray(numbers) ?
                $ts(numbers) :
                numbers;
            var min = seq.Min();
            var max = seq.Max();
            return new NumericRange(min, max);
        };
        // #endregion
        // #region Public Methods (3)
        /**
         * 判断目标数值是否在当前的这个数值范围之内
        */
        NumericRange.prototype.IsInside = function (x) {
            return x >= this.min && x <= this.max;
        };
        /**
         * 将一个位于此区间内的实数映射到另外一个区间之中
        */
        NumericRange.prototype.ScaleMapping = function (x, range) {
            var percentage = (x - this.min) / this.Length;
            var y = percentage * (range.max - range.min) + range.min;
            return y;
        };
        /**
         * Get a numeric sequence within current range with a given step
         *
         * @param step The delta value of the step forward,
         *      by default is 10% of the range length.
        */
        NumericRange.prototype.PopulateNumbers = function (step) {
            if (step === void 0) { step = (this.Length / 10); }
            var data = [];
            for (var x = this.min; x < this.max; x += step) {
                data.push(x);
            }
            return data;
        };
        /**
         * Display the range in format ``[min, max]``
        */
        NumericRange.prototype.toString = function () {
            return "[" + this.min + ", " + this.max + "]";
        };
        return NumericRange;
    }());
    data_1.NumericRange = NumericRange;
})(data || (data = {}));
/// <reference path="./Abstracts/TS.ts" />
/// <reference path="../../Data/StringHelpers/URL.ts" />
/// <reference path="../../Data/StringHelpers/PathHelper.ts" />
/// <reference path="../Modes.ts" />
/// <reference path="../../DOM/Document.ts" />
/// <reference path="../../Data/Range.ts" />
/**
 * The internal implementation of the ``$ts`` object.
*/
var Internal;
(function (Internal) {
    Internal.StringEval = new Internal.Handlers.stringEval();
    /**
     * 对``$ts``对象的内部实现过程在这里
    */
    function Static() {
        var handle = Internal.Handlers.Shared;
        var ins = function (any, args) { return queryFunction(handle, any, args); };
        var stringEval = handle.string();
        ins.mode = Modes.production;
        ins = extendsUtils(ins, stringEval);
        ins = extendsLINQ(ins);
        ins = extendsHttpHelpers(ins);
        ins = extendsSelector(ins);
        return ins;
    }
    Internal.Static = Static;
    function extendsHttpHelpers(ts) {
        ts.post = function (url, data, callback, options) {
            var contentType = HttpHelpers.measureContentType(data);
            var post = {
                type: contentType,
                data: data,
                sendContentType: (options || {}).sendContentType || true
            };
            HttpHelpers.POST(urlSolver(url), post, function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };
        ts.getText = function (url, callback) {
            HttpHelpers.GetAsyn(urlSolver(url), callback);
        };
        ts.get = function (url, callback) {
            HttpHelpers.GetAsyn(urlSolver(url), function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };
        ts.upload = function (url, file, callback) {
            HttpHelpers.UploadFile(urlSolver(url), file, null, function (response) {
                if (callback) {
                    callback(handleJSON(response));
                }
            });
        };
        ts.location = buildURLHelper();
        ts.parseURL = (function (url) { return new TypeScript.URL(url); });
        ts.goto = function (url, opt) {
            if (opt === void 0) { opt = { currentFrame: false, lambda: false }; }
            if (url.charAt(0) == "#") {
                // url是一个文档节点id表达式，则执行文档内跳转
                TypeScript.URL.JumpToHash(url);
            }
            else if (opt.lambda) {
                return function () {
                    Goto(url, opt.currentFrame);
                };
            }
            else {
                Goto(url, opt.currentFrame);
            }
        };
        return ts;
    }
    function buildURLHelper() {
        var url = TypeScript.URL.WindowLocation();
        var location = function (arg, caseSensitive, Default) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            if (Default === void 0) { Default = ""; }
            return url.getArgument(arg, caseSensitive, Default);
        };
        location.path = url.path || "/";
        location.fileName = url.fileName;
        location.hash = function (arg, urlhash) {
            if (arg === void 0) { arg = { trimprefix: true, doJump: false }; }
            if (urlhash === void 0) { urlhash = null; }
            if (!isNullOrUndefined(urlhash)) {
                if (((typeof arg == "boolean") && (arg === true)) || arg.doJump) {
                    window.location.hash = urlhash;
                }
                else {
                    TypeScript.URL.SetHash(urlhash);
                }
            }
            else {
                // 获取当前url字符串之中hash标签值
                var tag = window.location.hash;
                var trimprefix;
                if (typeof arg == "boolean") {
                    trimprefix = arg;
                }
                else {
                    trimprefix = arg.trimprefix;
                }
                if (tag && trimprefix && (tag.length > 1)) {
                    return tag.substr(1);
                }
                else {
                    return isNullOrUndefined(tag) ? "" : tag;
                }
            }
        };
        return location;
    }
    var querySymbols = [":", "_"];
    function isValidSymbol(c) {
        if (querySymbols.indexOf(c) > -1) {
            return true;
        }
        else {
            return Strings.isNumber(c) || Strings.isAlphabet(c);
        }
    }
    /**
     * 支持对meta标签解析内容的还原
     *
     * @param url 对于meta标签，只会转义字符串最开始的url部分
    */
    function urlSolver(url, currentFrame) {
        // var url = "@view:task/user/xyz";
        // 在这里指定标签规则：
        // 1. 以@符号起始，能够包含的符号为冒号:，下划线_，字母和数字，其他的符号都会被看作为结束符号
        // 2. meta查询标签必须位于url字符串的起始位置，否则不进行解析
        if (currentFrame === void 0) { currentFrame = false; }
        if (url.charAt(0) == "@") {
            // 可能是对meta标签的查询
            // 去除第一个@标记符号之后进行查询
            // 因为url可能会带有@，所以可能会出现误查询的情况，所以在这里默认值设置为url
            // 当误查询的时候就会查询不到结果的时候，就可以返回当前的url值了
            var tag = [];
            var c;
            var metaQuery;
            // 第一个符号是@符号，跳过
            for (var i = 1; i < url.length; i++) {
                if (isValidSymbol(c = url.charAt(i))) {
                    tag.push(c);
                }
                else {
                    break;
                }
            }
            metaQuery = tag.join("");
            url = DOM.metaValue(metaQuery, metaQuery, !currentFrame) + url.substr(tag.length + 1);
        }
        return url;
    }
    Internal.urlSolver = urlSolver;
    function handleJSON(response) {
        if (typeof response == "string") {
            /*
            if (TsLinq.URL.IsWellFormedUriString(response)) {
                // 是一个uri字符串，则不做解析
                return response;
            }*/
            // 尝试以json的格式进行结果的解析
            try {
                return JSON.parse(response);
            }
            catch (ex) {
                console.error("Invalid json text: ");
                console.error(response);
                throw ex;
            }
        }
        else {
            return response;
        }
    }
    function extendsUtils(ts, stringEval) {
        ts.imports = function (jsURL, callback, onErrorResumeNext, echo) {
            if (callback === void 0) { callback = DoNothing; }
            if (onErrorResumeNext === void 0) { onErrorResumeNext = false; }
            if (echo === void 0) { echo = false; }
            return new HttpHelpers.Imports(jsURL, onErrorResumeNext, echo).doLoad(callback);
        };
        ts.eval = function (script, lzw, callback) {
            if (lzw === void 0) { lzw = false; }
            if (lzw) {
                script = LZW.decode(script);
            }
            HttpHelpers.Imports.doEval(script, callback);
        };
        ts.inject = function (iframe, fun) {
            var frame = $ts(iframe);
            var envir = frame.contentWindow;
            if (TypeScript.logging.outputEverything) {
                console.log(fun);
            }
            if (Array.isArray(fun)) {
                for (var _i = 0, fun_1 = fun; _i < fun_1.length; _i++) {
                    var p = fun_1[_i];
                    envir.eval(p.toString());
                }
            }
            else if (typeof fun == "string") {
                envir.eval(fun);
            }
            else {
                envir.eval(fun.toString());
            }
        };
        ts.text = function (id, htmlText) {
            if (htmlText === void 0) { htmlText = false; }
            var nodeID = Internal.Handlers.EnsureNodeId(id);
            var node = stringEval.doEval(nodeID, null, null);
            return htmlText ? node.innerHTML : node.innerText;
        };
        ts.loadJSON = function (id) {
            return JSON.parse(this.text(id));
        };
        // file path helpers
        ts.parseFileName = TsLinq.PathHelper.fileName;
        /**
         * 得到不带有拓展名的文件名部分的字符串
         *
         * @param path Full name
        */
        ts.baseName = TsLinq.PathHelper.basename;
        /**
         * 得到不带小数点的文件拓展名字符串
         *
         * @param path Full name
        */
        ts.extensionName = TsLinq.PathHelper.extensionName;
        ts.withExtensionName = function (path, ext) {
            var fileExt = $ts.extensionName(path);
            var equals = fileExt.toLowerCase() == ext.toLowerCase();
            return equals;
        };
        ts.doubleRange = data.NumericRange.Create;
        return ts;
    }
    function extendsLINQ(ts) {
        ts.isNullOrEmpty = function (obj) {
            return IsNullOrEmpty(obj);
        };
        ts.from = From;
        ts.csv = {
            toObjects: function (data) { return csv.dataframe.Parse(data).Objects(); },
            toText: function (data) { return csv.toDataFrame(data).buildDoc(); }
        };
        ts.evalHTML = DOM.CreateHTMLTableNode;
        ts.appendTable = DOM.AddHTMLTable;
        return ts;
    }
    function extendsSelector(ts) {
        ts.select = function (query, context) {
            if (context === void 0) { context = window; }
            return Internal.Handlers.stringEval.select(query, context);
        };
        ts.select.getSelectedOptions = function (query, context) {
            if (context === void 0) { context = window; }
            var sel = $ts(query, {
                context: context
            });
            var options = DOM.getSelectedOptions(sel);
            return new DOMEnumerator(options);
        };
        ts.select.getOption = function (query, context) {
            if (context === void 0) { context = window; }
            var sel = $ts(query, {
                context: context
            });
            var options = DOM.getSelectedOptions(sel);
            if (options.length == 0) {
                return null;
            }
            else {
                return options[0].value;
            }
        };
        return ts;
    }
    function queryFunction(handle, any, args) {
        var type = TypeInfo.typeof(any);
        var typeOf = type.typeOf;
        var eval = typeOf in handle ? handle[typeOf]() : null;
        if (type.IsArray) {
            // 转化为序列集合对象，相当于from函数                
            return eval.doEval(any, type, args);
        }
        else if (type.typeOf == "function") {
            // 当html文档加载完毕之后就会执行传递进来的这个
            // 函数进行初始化
            DOM.ready(any);
        }
        else if (!isNullOrUndefined(eval)) {
            // 对html文档之中的节点元素进行查询操作
            // 或者创建新的节点
            return eval.doEval(any, type, args);
        }
        else {
            eval = handle[type.class];
            if (!isNullOrUndefined(eval)) {
                return eval().doEval(any, type, args);
            }
            else {
                throw "Unsupported data type: " + type.toString();
            }
        }
    }
    Internal.queryFunction = queryFunction;
})(Internal || (Internal = {}));
/// <reference path="Data/StringHelpers/sprintf.ts" />
/// <reference path="Collections/Abstract/Enumerator.ts" />
/// <reference path="Framework/Define/Handlers/Handlers.ts" />
/// <reference path="Helpers/Extensions.ts" />
/// <reference path="Helpers/Strings.ts" />
/// <reference path="Type.ts" />
/// <reference path="Data/Encoder/MD5.ts" />
/// <reference path="Framework/Define/Internal.ts" />
// note: 2018-12-25
// this module just working on browser, some of the DOM api
// related function may not works as expected on server side 
// ``nodejs`` Environment.
if (typeof String.prototype['startsWith'] != 'function') {
    String.prototype['startsWith'] = function (str) {
        return this.slice(0, str.length) == str;
    };
}
/**
 * 动态加载脚本文件，然后在完成脚本文件的加载操作之后，执行一个指定的函数操作
 *
 * @param callback 如果这个函数之中存在有HTML文档的操作，则可能会需要将代码放在``$ts(() => {...})``之中，
 *     等待整个html文档加载完毕之后再做程序的执行，才可能会得到正确的执行结果
*/
function $imports(jsURL, callback, onErrorResumeNext, echo) {
    if (callback === void 0) { callback = DoNothing; }
    if (onErrorResumeNext === void 0) { onErrorResumeNext = false; }
    if (echo === void 0) { echo = false; }
    return new HttpHelpers
        .Imports(jsURL, onErrorResumeNext, echo)
        .doLoad(callback);
}
/**
 * 使用script标签进行脚本文件的加载
 * 因为需要向body添加script标签，所以这个函数会需要等到文档加载完成之后才会被执行
*/
function $include(jsURL) {
    if (typeof jsURL == "string") {
        jsURL = [jsURL];
    }
    $ts(function () { return jsURL.forEach(function (js) {
        var script = $ts("<script>", {
            type: "text/javascript",
            src: js
        });
        script.onload = function () {
            document.body.removeChild(script);
        };
        document.body.appendChild(script);
    }); });
}
/**
 * 计算字符串的MD5值字符串
*/
function md5(string, key, raw) {
    if (key === void 0) { key = null; }
    if (raw === void 0) { raw = null; }
    return MD5.calculate(string, key, raw);
}
/**
 * Linq数据流程管线的起始函数
 *
 * @param source 需要进行数据加工的集合对象
*/
function From(source) {
    return new IEnumerator(source);
}
/**
 * 将一个给定的字符串转换为组成该字符串的所有字符的枚举器
*/
function CharEnumerator(str) {
    return new IEnumerator(Strings.ToCharArray(str));
}
/**
 * 判断目标对象集合是否是空的？
 *
 * 这个函数也包含有``isNullOrUndefined``函数的判断功能
 *
 * @param array 如果这个数组对象是空值或者未定义，都会被判定为空，如果长度为零，则同样也会被判定为空值
*/
function IsNullOrEmpty(array) {
    if (array == null || array == undefined) {
        return true;
    }
    else if (Array.isArray(array) && array.length == 0) {
        return true;
    }
    else if (array.Count == 0) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * 查看目标变量的对象值是否是空值或者未定义
*/
function isNullOrUndefined(obj) {
    if (obj == null || obj == undefined) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * HTML/Javascript: how to access JSON data loaded in a script tag.
 *
 * @param id 节点的id值，不带有``#``符号前缀的
*/
function LoadJson(id) {
    return JSON.parse(LoadText(id));
}
function LoadText(id) {
    return document.getElementById(id).textContent;
}
/**
 * Quick Tip: Get URL Parameters with JavaScript
 *
 * > https://www.sitepoint.com/get-url-parameters-with-javascript/
 *
 * @param url get query string from url (optional) or window
*/
function getAllUrlParams(url) {
    if (url === void 0) { url = window.location.href; }
    if (url.indexOf("?") > -1) {
        // if query string exists
        var queryString = Strings.GetTagValue(url, '?').value;
        var args = DataExtensions.parseQueryString(queryString);
        return new Dictionary(args);
    }
    else {
        return new Dictionary({});
    }
}
/**
 * 调用这个函数会从当前的页面跳转到指定URL的页面
 *
 * 如果当前的这个页面是一个iframe页面，则会通过父页面进行跳转
 *
 * @param url 这个参数支持对meta标签数据的查询操作
 * @param currentFrame 如果这个参数为true，则不会进行父页面的跳转操作
*/
function Goto(url, currentFrame) {
    if (currentFrame === void 0) { currentFrame = false; }
    var win = window;
    if (!currentFrame) {
        // 从最顶层的文档页面进行跳转
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/top
        win = window.top;
    }
    win.location.href = Internal.urlSolver(url, currentFrame);
}
/**
 * 这个函数会自动处理多行的情况
*/
function base64_decode(stream) {
    var data = Strings.lineTokens(stream);
    var base64Str = From(data)
        .Where(function (s) { return s && s.length > 0; })
        .Select(function (s) { return s.trim(); })
        .JoinBy("");
    var text = Base64.decode(base64Str);
    return text;
}
/**
 * 这个函数什么也不做，主要是用于默认的参数值
*/
function DoNothing() {
    return null;
}
/**
 * 将指定的SVG节点保存为png图片
 *
 * @param svg 需要进行保存为图片的svg节点的对象实例或者对象的节点id值
 * @param name 所保存的文件名
 * @param options 配置参数，直接留空使用默认值就好了
*/
function saveSvgAsPng(svg, name, options) {
    if (options === void 0) { options = CanvasHelper.saveSvgAsPng.Options.Default(); }
    return CanvasHelper.saveSvgAsPng.Encoder.saveSvgAsPng(svg, name, options);
}
/**
 * ### Javascript sprintf
 *
 * > http://www.webtoolkit.info/javascript-sprintf.html#.W5sf9FozaM8
 *
 * Several programming languages implement a sprintf function, to output a
 * formatted string. It originated from the C programming language, printf
 * function. Its a string manipulation function.
 *
 * This is limited sprintf Javascript implementation. Function returns a
 * string formatted by the usual printf conventions. See below for more details.
 * You must specify the string and how to format the variables in it.
*/
var sprintf = data.sprintf.doFormat;
var executeJavaScript = "javascript:void(0);";
/**
 * 对于这个函数的返回值还需要做类型转换
 *
 * 如果是节点查询或者创建的话，可以使用``asExtends``属性来获取``HTMLTsElememnt``拓展对象
*/
var $ts = Internal.Static();
/**
 * 从文档之中查询或者创建一个新的图像标签元素
*/
function $image(query, args) {
    return Internal.StringEval.doEval(query, null, args);
}
/**
 * 从文档之中查询或者创建一个新的输入标签元素
*/
function $input(query, args) {
    return Internal.StringEval.doEval(query, null, args);
}
function $link(query, args) {
    return Internal.StringEval.doEval(query, null, args);
}
/// <reference path="./Collections/Map.ts" />
var TypeExtensions;
(function (TypeExtensions) {
    TypeExtensions.objectIsNothing = "Object is nothing! [https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/nothing]";
    /**
     * 字典类型的元素类型名称字符串
    */
    TypeExtensions.DictionaryMap = TypeInfo.getClass(new MapTuple("", ""));
    function ensureNumeric(x) {
        if (typeof x == "number") {
            return x;
        }
        else {
            return parseFloat(x);
        }
    }
    TypeExtensions.ensureNumeric = ensureNumeric;
})(TypeExtensions || (TypeExtensions = {}));
/// <reference path="./Abstract/Enumerator.ts" />
/**
 * 按照某一个键值进行分组的集合对象
*/
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(key, group) {
        var _this = _super.call(this, group) || this;
        _this.Key = key;
        return _this;
    }
    Object.defineProperty(Group.prototype, "Group", {
        /**
         * Group members, readonly property.
        */
        get: function () {
            return this.sequence;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 创建一个键值对映射序列，这些映射都具有相同的键名
    */
    Group.prototype.ToMaps = function () {
        var _this = this;
        return From(this.sequence)
            .Select(function (x) { return new MapTuple(_this.Key, x); })
            .ToArray();
    };
    return Group;
}(IEnumerator));
/// <reference path="./Abstract/Enumerator.ts" />
/**
 * 表示一个动态列表对象
*/
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(src) {
        if (src === void 0) { src = null; }
        return _super.call(this, src || []) || this;
    }
    /**
     * 可以使用这个方法进行静态代码的链式添加
    */
    List.prototype.Add = function (x) {
        this.sequence.push(x);
        return this;
    };
    /**
     * 批量的添加
    */
    List.prototype.AddRange = function (x) {
        var _this = this;
        if (Array.isArray(x)) {
            x.forEach(function (o) { return _this.sequence.push(o); });
        }
        else {
            x.ForEach(function (o) { return _this.sequence.push(o); });
        }
        return this;
    };
    /**
     * 查找给定的元素在当前的这个列表之中的位置，不存在则返回-1
    */
    List.prototype.IndexOf = function (x) {
        return this.sequence.indexOf(x);
    };
    /**
     * 返回列表之中的第一个元素，然后删除第一个元素，剩余元素整体向前平移一个单位
    */
    List.prototype.Pop = function () {
        var x1 = this.First;
        this.sequence = this.sequence.slice(1);
        return x1;
    };
    return List;
}(IEnumerator));
var Matrix = /** @class */ (function (_super) {
    __extends(Matrix, _super);
    /**
     * [m, n], m列n行
    */
    function Matrix(m, n, fill) {
        if (fill === void 0) { fill = null; }
        return _super.call(this, Matrix.emptyMatrix(m, n, fill)) || this;
    }
    Object.defineProperty(Matrix.prototype, "rows", {
        get: function () {
            return this.sequence.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "columns", {
        get: function () {
            return this.sequence[0].length;
        },
        enumerable: true,
        configurable: true
    });
    Matrix.emptyMatrix = function (m, n, fill) {
        var matrix = [];
        for (var i = 0; i < n; i++) {
            matrix.push(DataExtensions.Dim(m, fill));
        }
        return matrix;
    };
    Matrix.prototype.M = function (i, j, val) {
        if (val === void 0) { val = null; }
        if (isNullOrUndefined(val)) {
            // get
            return this.sequence[i][j];
        }
        else {
            this.sequence[i][j] = val;
        }
    };
    Matrix.prototype.column = function (i, set) {
        if (set === void 0) { set = null; }
        if (isNullOrUndefined(set)) {
            // get
            var col = [];
            for (var j = 0; j < this.rows; j++) {
                col.push(this.sequence[j][i]);
            }
            return col;
        }
        else {
            var col = void 0;
            if (Array.isArray(set)) {
                col = set;
            }
            else {
                col = set.ToArray(false);
            }
            for (var j = 0; j < this.rows; j++) {
                this.sequence[j][i] = col[j];
            }
            return null;
        }
    };
    Matrix.prototype.row = function (i, set) {
        if (set === void 0) { set = null; }
        if (isNullOrUndefined(set)) {
            // get
            return this.sequence[i];
        }
        else {
            if (Array.isArray(set)) {
                this.sequence[i] = set;
            }
            else {
                this.sequence[i] = set.ToArray(false);
            }
        }
    };
    Matrix.prototype.toString = function () {
        return "[" + this.rows + ", " + this.columns + "]";
    };
    return Matrix;
}(IEnumerator));
/// <reference path="./Abstract/Enumerator.ts" />
/**
 * A data sequence object with a internal index pointer.
*/
var Pointer = /** @class */ (function (_super) {
    __extends(Pointer, _super);
    function Pointer(src) {
        var _this = _super.call(this, src) || this;
        // 2018-09-02 在js里面，数值必须要进行初始化
        // 否则会出现NA初始值，导致使用EndRead属性判断失败
        // 可能会导致死循环的问题出现
        _this.p = 0;
        return _this;
    }
    Object.defineProperty(Pointer.prototype, "EndRead", {
        /**
         * The index pointer is at the end of the data sequence?
        */
        get: function () {
            return this.p >= this.Count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "Current", {
        /**
         * Get the element value in current location i;
        */
        get: function () {
            return this.sequence[this.p];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "Next", {
        /**
         * Get current index element value and then move the pointer
         * to next position.
        */
        get: function () {
            var x = this.Current;
            this.p = this.p + 1;
            return x;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Just move the pointer to the next position and then
     * returns current pointer object.
    */
    Pointer.prototype.MoveNext = function () {
        this.p = this.p + 1;
        return this;
    };
    /**
     * 以当前的位置为基础，得到偏移后的位置的值，但不会改变现有的指针的位置值
    */
    Pointer.prototype.Peek = function (offset) {
        return this.sequence[this.p + offset];
    };
    return Pointer;
}(IEnumerator));
/// <reference path="./Abstract/Enumerator.ts" />
/**
 * 序列之中的对某一个区域的滑窗操作结果对象
*/
var SlideWindow = /** @class */ (function (_super) {
    __extends(SlideWindow, _super);
    function SlideWindow(index, src) {
        var _this = _super.call(this, src) || this;
        _this.index = index;
        return _this;
    }
    /**
     * 创建指定片段长度的滑窗对象
     *
     * @param winSize 滑窗片段的长度
     * @param step 滑窗的步进长度，默认是一个步进
    */
    SlideWindow.Split = function (src, winSize, step) {
        if (step === void 0) { step = 1; }
        if (!Array.isArray(src)) {
            src = src.ToArray();
        }
        var len = src.length - winSize;
        var windows = [];
        for (var i = 0; i < len; i += step) {
            var chunk = new Array(winSize);
            for (var j = 0; j < winSize; j++) {
                chunk[j] = src[i + j];
            }
            windows.push(new SlideWindow(i, chunk));
        }
        return new IEnumerator(windows);
    };
    return SlideWindow;
}(IEnumerator));
/// <reference path="../Collections/Abstract/Enumerator.ts" />
/**
 * http://www.rfc-editor.org/rfc/rfc4180.txt
*/
var csv;
(function (csv_1) {
    /**
     * Common Format and MIME Type for Comma-Separated Values (CSV) Files
    */
    var contentType = "text/csv";
    /**
     * ``csv``文件模型
    */
    var dataframe = /** @class */ (function (_super) {
        __extends(dataframe, _super);
        /**
         * 从行序列之中构建出一个csv对象模型
        */
        function dataframe(rows) {
            return _super.call(this, rows) || this;
        }
        Object.defineProperty(dataframe.prototype, "headers", {
            /**
             * Csv文件的第一行作为header
            */
            get: function () {
                return new IEnumerator(this.sequence[0]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(dataframe.prototype, "contents", {
            /**
             * 获取除了第一行作为``header``数据的剩余的所有的行数据
            */
            get: function () {
                return this.Skip(1);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取指定列名称的所有的行的列数据
         *
         * @param name csv文件的列名称，第一行之中的文本数据的内容
         *
         * @returns 该使用名称所指定的列的所有的内容字符串的枚举序列对象
        */
        dataframe.prototype.Column = function (name) {
            var index = this.sequence[0].indexOf(name);
            if (index == -1) {
                return new IEnumerator([]);
            }
            else {
                return this.Select(function (r) { return r.ElementAt(index); });
            }
        };
        /**
         * 向当前的数据框对象之中添加一行数据
        */
        dataframe.prototype.AppendLine = function (line) {
            this.sequence.push(line);
            return this;
        };
        /**
         * 向当前的数据框对象之中添加多行数据
        */
        dataframe.prototype.AppendRows = function (data) {
            var _this = this;
            if (Array.isArray(data)) {
                data.forEach(function (r) { return _this.sequence.push(r); });
            }
            else {
                data.ForEach(function (r) { return _this.sequence.push(r); });
            }
            return this;
        };
        /**
         * 将当前的这个数据框对象转换为csv文本内容
        */
        dataframe.prototype.buildDoc = function () {
            return this.Select(function (r) { return r.rowLine; }).JoinBy("\n");
        };
        /**
         * 使用反射操作将csv文档转换为特定类型的对象数据序列
         *
         * @param fieldMaps 这个参数是一个对象，其描述了如何将csv文档之中在js之中
         *     的非法标识符转换为合法的标识符的映射
         * @param activator 这个函数指针描述了如何创建一个新的指定类型的对象的过程，
         *     这个函数指针不可以有参数的传递。
         *
         * @returns 这个函数返回类型约束的对象Linq序列集合
        */
        dataframe.prototype.Objects = function (fieldMaps, activator) {
            if (fieldMaps === void 0) { fieldMaps = {}; }
            if (activator === void 0) { activator = function () {
                return {};
            }; }
            var header = dataframe.ensureMapsAll(fieldMaps, this.headers.ToArray());
            var objs = this
                .Skip(1)
                .Select(function (r) {
                var o = activator();
                r.ForEach(function (c, i) {
                    o[header(i)] = c;
                });
                return o;
            });
            return objs;
        };
        dataframe.ensureMapsAll = function (fieldMaps, headers) {
            for (var i = 0; i < headers.length; i++) {
                var column = headers[i];
                if (column in fieldMaps) {
                    // do nothing
                }
                else {
                    // fill gaps
                    fieldMaps[column] = column;
                }
            }
            return function (i) {
                return fieldMaps[headers[i]];
            };
        };
        /**
         * 使用ajax将csv文件保存到服务器
         *
         * @param url csv文件数据将会被通过post方法保存到这个url所指定的网络资源上面
         * @param callback ajax异步回调，默认是打印返回结果到终端之上
         *
        */
        dataframe.prototype.save = function (url, fileName, callback) {
            if (fileName === void 0) { fileName = "upload.csv"; }
            if (callback === void 0) { callback = function (response) {
                console.log(response);
            }; }
            var file = this.buildDoc();
            HttpHelpers.UploadFile(url, file, fileName, callback);
        };
        /**
         * 使用ajax GET加载csv文件数据，不推荐使用这个方法处理大型的csv文件数据
         *
         * @param callback 当这个异步回调为空值的时候，函数使用同步的方式工作，返回csv对象
         *                 如果这个参数不是空值，则以异步的方式工作，此时函数会返回空值
         * @param parseText 如果url返回来的数据之中还包含有其他的信息，则会需要这个参数来进行csv文本数据的解析
        */
        dataframe.Load = function (url, callback, parseText) {
            if (callback === void 0) { callback = null; }
            if (parseText === void 0) { parseText = this.defaultContent; }
            if (callback == null || callback == undefined) {
                // 同步
                var load = parseText(HttpHelpers.GET(url));
                var tsv = load.type == "tsv";
                return dataframe.Parse(load.content, tsv);
            }
            else {
                // 异步
                HttpHelpers.GetAsyn(url, function (text, code, contentType) {
                    if (code == 200) {
                        var load = parseText(text, contentType);
                        var tsv = load.type == "tsv";
                        var data = dataframe.Parse(load.content, tsv);
                        console.log(data.headers);
                        callback(data);
                    }
                    else {
                        throw "Error while load csv data source, http " + code + ": " + text;
                    }
                });
            }
            return null;
        };
        dataframe.defaultContent = function (content) {
            return {
                type: "csv",
                content: content
            };
        };
        /**
         * 将所给定的文本文档内容解析为数据框对象
         *
         * @param tsv 所需要进行解析的文本内容是否为使用``<TAB>``作为分割符的tsv文本文件？
         *   默认不是，即默认使用逗号``,``作为分隔符的csv文本文件。
        */
        dataframe.Parse = function (text, tsv) {
            if (tsv === void 0) { tsv = false; }
            var parse = tsv ? csv_1.row.ParseTsv : csv_1.row.Parse;
            var allTextLines = $ts.from(text.split(/\n/));
            var rows;
            if (Strings.Empty(allTextLines.Last)) {
                // 2019-1-2 因为文本文件很有可能是以空行结尾的
                // 所以在这里需要做下额外的判断
                // 否则会在序列的最后面出现一行空数据
                // 这个空数据很有可能会对下游程序代码产生bug影响
                rows = allTextLines
                    .Take(allTextLines.Count - 1)
                    .Select(parse);
            }
            else {
                rows = allTextLines.Select(parse);
            }
            return new dataframe(rows);
        };
        return dataframe;
    }(IEnumerator));
    csv_1.dataframe = dataframe;
})(csv || (csv = {}));
var csv;
(function (csv) {
    /**
     * 将对象序列转换为``dataframe``对象
     *
     * 这个函数只能够转换object类型的数据，对于基础类型将不保证能够正常工作
     *
     * @param data 因为这个对象序列对象是具有类型约束的，所以可以直接从第一个
     *    元素对象之中得到所有的属性名称作为csv文件头的数据
    */
    function toDataFrame(data) {
        var seq = Array.isArray(data) ? new IEnumerator(data) : data;
        var header = $ts(Object.keys(seq.First));
        var rows = seq
            .Select(function (obj) {
            var columns = header
                .Select(function (ref, i) {
                return toString(obj[ref]);
            });
            return new csv.row(columns);
        });
        return new csv.dataframe([new csv.row(header)]).AppendRows(rows);
    }
    csv.toDataFrame = toDataFrame;
    function toString(obj) {
        if (isNullOrUndefined(obj)) {
            // 这个对象值是空的，所以在csv文件之中是空字符串
            return "";
        }
        else {
            return "" + obj;
        }
    }
})(csv || (csv = {}));
var csv;
(function (csv) {
    var HTML;
    (function (HTML) {
        var bootstrap = ["table", "table-hover"];
        /**
         * 将数据框对象转换为HTMl格式的表格对象的html代码
         *
         * @param tblClass 所返回来的html表格代码之中的table对象的类型默认是bootstrap类型的，
         * 所以默认可以直接应用bootstrap的样式在这个表格之上
         *
         * @returns 表格的HTML代码
        */
        function toHTMLTable(data, tblClass) {
            if (tblClass === void 0) { tblClass = bootstrap; }
            var th = data.headers
                .Select(function (h) { return "<th>" + h + "</th>"; })
                .JoinBy("\n");
            var tr = data.contents
                .Select(function (r) { return r.Select(function (c) { return "<td>" + c + "</td>"; }).JoinBy(""); })
                .Select(function (r) { return "<tr>" + r + "</tr>"; })
                .JoinBy("\n");
            return "\n            <table class=\"" + tblClass + "\">\n                <thead>\n                    <tr>" + th + "</tr>\n                </thead>\n                <tbody>\n                    " + tr + "\n                </tbody>\n            </table>";
        }
        HTML.toHTMLTable = toHTMLTable;
        function createHTMLTable(data, tblClass) {
            if (tblClass === void 0) { tblClass = bootstrap; }
            return toHTMLTable(csv.toDataFrame(data), tblClass);
        }
        HTML.createHTMLTable = createHTMLTable;
    })(HTML = csv.HTML || (csv.HTML = {}));
})(csv || (csv = {}));
var csv;
(function (csv) {
    /**
     * csv文件之中的一行数据，相当于当前行的列数据的集合
    */
    var row = /** @class */ (function (_super) {
        __extends(row, _super);
        function row(cells) {
            return _super.call(this, cells) || this;
        }
        Object.defineProperty(row.prototype, "columns", {
            /**
             * 当前的这一个行对象的列数据集合
             *
             * 注意，你无法通过直接修改这个数组之中的元素来达到修改这个行之中的值的目的
             * 因为这个属性会返回这个行的数组值的复制对象
            */
            get: function () {
                return this.sequence.slice();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(row.prototype, "rowLine", {
            /**
             * 这个只读属性仅用于生成csv文件
            */
            get: function () {
                return From(this.columns)
                    .Select(row.autoEscape)
                    .JoinBy(",");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the index of the first occurrence of a value in an array.
         *
         * 函数得到指定的值在本行对象之中的列的编号
         *
         * @param value The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If ``fromIndex`` is omitted,
         *      the search starts at index 0.
         *
         * @returns 如果这个函数返回-1则表示找不到
        */
        row.prototype.indexOf = function (value, fromIndex) {
            if (fromIndex === void 0) { fromIndex = null; }
            if (isNullOrUndefined(fromIndex)) {
                return this.sequence.indexOf(value);
            }
            else {
                return this.sequence.indexOf(value, fromIndex);
            }
        };
        row.prototype.ProjectObject = function (headers) {
            var obj = {};
            var data = this.columns;
            if (Array.isArray(headers)) {
                headers.forEach(function (h, i) {
                    obj[h] = data[i];
                });
            }
            else {
                headers.ForEach(function (h, i) {
                    obj[h] = data[i];
                });
            }
            return obj;
        };
        row.autoEscape = function (c) {
            if (c.indexOf(",") > -1) {
                return "\"" + c + "\"";
            }
            else {
                return c;
            }
        };
        row.Parse = function (line) {
            return new row(csv.CharsParser(line));
        };
        row.ParseTsv = function (line) {
            return new row(csv.CharsParser(line, "\t"));
        };
        return row;
    }(IEnumerator));
    csv.row = row;
})(csv || (csv = {}));
/// <reference path="../Collections/Pointer.ts" />
var csv;
(function (csv) {
    /**
     * 通过Chars枚举来解析域，分隔符默认为逗号
     * > https://github.com/xieguigang/sciBASIC/blame/701f9d0e6307a779bb4149c57a22a71572f1e40b/Data/DataFrame/IO/csv/Tokenizer.vb#L97
     *
    */
    function CharsParser(s, delimiter, quot) {
        if (delimiter === void 0) { delimiter = ","; }
        if (quot === void 0) { quot = '"'; }
        var tokens = [];
        var temp = [];
        var openStack = false;
        var buffer = From(Strings.ToCharArray(s)).ToPointer();
        var dblQuot = new RegExp("[" + quot + "]{2}", 'g');
        var cellStr = function () {
            // https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
            // 2018-09-02
            // 如果join函数的参数是空的话，则js之中默认是使用逗号作为连接符的 
            return temp.join("").replace(dblQuot, quot);
        };
        var procEscape = function (c) {
            if (!StartEscaping(temp)) {
                // 查看下一个字符是否为分隔符
                // 因为前面的 Dim c As Char = +buffer 已经位移了，所以在这里直接取当前的字符
                var peek = buffer.Current;
                // 也有可能是 "" 转义 为单个 "
                var lastQuot = (temp.length > 0 && temp[temp.length - 1] != quot);
                if (temp.length == 0 && peek == delimiter) {
                    // openStack意味着前面已经出现一个 " 了
                    // 这里又出现了一个 " 并且下一个字符为分隔符
                    // 则说明是 "", 当前的cell内容是一个空字符串
                    tokens.push("");
                    temp = [];
                    buffer.MoveNext();
                    openStack = false;
                }
                else if ((peek == delimiter || buffer.EndRead) && lastQuot) {
                    // 下一个字符为分隔符，则结束这个token
                    tokens.push(cellStr());
                    temp = [];
                    // 跳过下一个分隔符，因为已经在这里判断过了
                    buffer.MoveNext();
                    openStack = false;
                }
                else {
                    // 不是，则继续添加
                    temp.push(c);
                }
            }
            else {
                // \" 会被转义为单个字符 "
                temp[temp.length - 1] = c;
            }
        };
        while (!buffer.EndRead) {
            var c = buffer.Next;
            if (openStack) {
                if (c == quot) {
                    procEscape(c);
                }
                else {
                    // 由于双引号而产生的转义          
                    temp.push(c);
                }
            }
            else {
                if (temp.length == 0 && c == quot) {
                    // token的第一个字符串为双引号，则开始转义
                    openStack = true;
                }
                else {
                    if (c == delimiter) {
                        tokens.push(cellStr());
                        temp = [];
                    }
                    else {
                        temp.push(c);
                    }
                }
            }
        }
        if (temp.length > 0) {
            tokens.push(cellStr());
        }
        return tokens;
    }
    csv.CharsParser = CharsParser;
    /**
     * 当前的token对象之中是否是转义的起始，即当前的token之中的最后一个符号
     * 是否是转义符<paramref name="escape"/>?
    */
    function StartEscaping(buffer, escape) {
        if (escape === void 0) { escape = "\\"; }
        if (IsNullOrEmpty(buffer)) {
            return false;
        }
        else {
            return buffer[buffer.length - 1] == escape;
        }
    }
})(csv || (csv = {}));
var TsLinq;
(function (TsLinq) {
    /**
     * 这个对象可以自动的将调用者的函数名称作为键名进行对应的键值的读取操作
    */
    var MetaReader = /** @class */ (function () {
        function MetaReader(meta) {
            this.meta = meta;
        }
        /**
         * Read meta object value by call name
         *
         * > https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
        */
        MetaReader.prototype.GetValue = function (key) {
            if (key === void 0) { key = null; }
            if (!key) {
                key = TsLinq.StackTrace.GetCallerMember().memberName;
            }
            if (key in this.meta) {
                return this.meta[key];
            }
            else {
                return null;
            }
        };
        return MetaReader;
    }());
    TsLinq.MetaReader = MetaReader;
})(TsLinq || (TsLinq = {}));
/// <reference path="../Collections/Abstract/Enumerator.ts" />
var TsLinq;
(function (TsLinq) {
    var PriorityQueue = /** @class */ (function (_super) {
        __extends(PriorityQueue, _super);
        function PriorityQueue() {
            return _super.call(this, []) || this;
        }
        Object.defineProperty(PriorityQueue.prototype, "Q", {
            /**
             * 队列元素
            */
            get: function () {
                return this.sequence;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
        */
        PriorityQueue.prototype.enqueue = function (obj) {
            var last = this.Last;
            var q = this.Q;
            var x = new QueueItem(obj);
            q.push(x);
            if (last) {
                last.below = x;
                x.above = last;
            }
        };
        PriorityQueue.prototype.extract = function (i) {
            var q = this.Q;
            var x_above = q[i - 1];
            var x_below = q[i + 1];
            var x = q.splice(i, 1)[0];
            if (x_above) {
                x_above.below = x_below;
            }
            if (x_below) {
                x_below.above = x_above;
            }
            return x;
        };
        PriorityQueue.prototype.dequeue = function () {
            return this.extract(0);
        };
        return PriorityQueue;
    }(IEnumerator));
    TsLinq.PriorityQueue = PriorityQueue;
    var QueueItem = /** @class */ (function () {
        function QueueItem(x) {
            this.value = x;
        }
        QueueItem.prototype.toString = function () {
            return this.value.toString();
        };
        return QueueItem;
    }());
    TsLinq.QueueItem = QueueItem;
})(TsLinq || (TsLinq = {}));
var DOM;
(function (DOM) {
    /**
     * HTML文档节点的查询类型
    */
    var QueryTypes;
    (function (QueryTypes) {
        QueryTypes[QueryTypes["NoQuery"] = 0] = "NoQuery";
        /**
         * 表达式为 #xxx
         * 按照节点的id编号进行查询
         *
         * ``<tag id="xxx">``
        */
        QueryTypes[QueryTypes["id"] = 1] = "id";
        /**
         * 表达式为 .xxx
         * 按照节点的class名称进行查询
         *
         * ``<tag class="xxx">``
        */
        QueryTypes[QueryTypes["class"] = 10] = "class";
        /**
         * 表达式为 xxx
         * 按照节点的名称进行查询
         *
         * ``<xxx ...>``
        */
        QueryTypes[QueryTypes["tagName"] = -100] = "tagName";
        /**
         * query meta tag content value by name
         *
         * ``@xxxx``
         *
         * ```html
         * <meta name="user-login" content="xieguigang" />
         * ```
        */
        QueryTypes[QueryTypes["QueryMeta"] = 200] = "QueryMeta";
    })(QueryTypes = DOM.QueryTypes || (DOM.QueryTypes = {}));
    var Query = /** @class */ (function () {
        function Query() {
        }
        /**
         * + ``#`` by id
         * + ``.`` by claSS
         * + ``&`` SINGLE NODE
         * + ``@`` read meta tag
         * + ``&lt;>`` create new tag
        */
        Query.parseQuery = function (expr) {
            var isSingle = false;
            if (expr.charAt(0) == "&") {
                isSingle = true;
                expr = expr.substr(1);
            }
            else {
                isSingle = false;
            }
            return Query.parseExpression(expr, isSingle);
        };
        /**
         * by node id
        */
        Query.getById = function (id) {
            return {
                type: QueryTypes.id,
                singleNode: true,
                expression: id
            };
        };
        /**
         * by class name
        */
        Query.getByClass = function (className, isSingle) {
            return {
                type: QueryTypes.class,
                singleNode: isSingle,
                expression: className
            };
        };
        /**
         * by tag name
        */
        Query.getByTag = function (tag, isSingle) {
            return {
                type: QueryTypes.tagName,
                singleNode: isSingle,
                expression: tag
            };
        };
        /**
         * create new node
        */
        Query.createElement = function (expr) {
            return {
                type: QueryTypes.NoQuery,
                singleNode: true,
                expression: expr
            };
        };
        Query.queryMeta = function (expr) {
            return {
                type: QueryTypes.QueryMeta,
                singleNode: true,
                expression: expr
            };
        };
        Query.isSelectorQuery = function (expr) {
            var hasMultiple = expr.indexOf(" ") > -1;
            var isNodeCreate = expr.charAt(0) == "<" && expr.charAt(expr.length - 1) == ">";
            return hasMultiple && !isNodeCreate;
        };
        Query.parseExpression = function (expr, isSingle) {
            var prefix = expr.charAt(0);
            if (Query.isSelectorQuery(expr)) {
                // 可能是复杂查询表达式
                return {
                    type: QueryTypes.tagName,
                    singleNode: isSingle,
                    expression: expr
                };
            }
            switch (prefix) {
                case "#": return this.getById(expr.substr(1));
                case ".": return this.getByClass(expr, isSingle);
                case "<": return this.createElement(expr);
                case "@": return this.queryMeta(expr.substr(1));
                default: return this.getByTag(expr, isSingle);
            }
        };
        return Query;
    }());
    DOM.Query = Query;
})(DOM || (DOM = {}));
var DOM;
(function (DOM) {
    var node = /** @class */ (function () {
        function node() {
        }
        node.FromNode = function (htmlNode) {
            var n = new node();
            n.tagName = htmlNode.tagName;
            n.id = htmlNode.id;
            n.classList = this.tokenList(htmlNode.classList);
            n.attrs = this.nameValueMaps(htmlNode.attributes);
            return n;
        };
        node.tokenList = function (tokens) {
            var list = [];
            for (var i = 0; i < tokens.length; i++) {
                list.push(tokens.item(i));
            }
            return list;
        };
        node.nameValueMaps = function (attrs) {
            var list = [];
            var attr;
            var map;
            for (var i = 0; i < attrs.length; i++) {
                attr = attrs.item(i);
                map = new NamedValue(attr.name, attr.value);
                list.push(map);
            }
            return list;
        };
        return node;
    }());
    DOM.node = node;
})(DOM || (DOM = {}));
var DOM;
(function (DOM) {
    /**
     * 用于解析XML节点之中的属性值的正则表达式
    */
    DOM.attrs = /\S+\s*[=]\s*((["].*["])|(['].*[']))/g;
    /**
     * 将表达式之中的节点名称，以及该节点上面的属性值都解析出来
    */
    function ParseNodeDeclare(expr) {
        // <a href="..." onclick="...">
        var declare = expr
            .substr(1, expr.length - 2)
            .trim();
        var tagValue = Strings.GetTagValue(declare, " ");
        var tag = tagValue.name;
        var attrs = [];
        if (tagValue.value.length > 0) {
            // 使用正则表达式进行解析
            attrs = From(tagValue.value.match(DOM.attrs))
                .Where(function (s) { return s.length > 0; })
                .Select(function (s) {
                var attr = Strings.GetTagValue(s, "=");
                var val = attr.value.trim();
                val = val.substr(1, val.length - 2);
                return new NamedValue(attr.name, val);
            }).ToArray();
        }
        return {
            tag: tag, attrs: attrs
        };
    }
    DOM.ParseNodeDeclare = ParseNodeDeclare;
})(DOM || (DOM = {}));
/**
 * 实现这个类需要重写下面的方法实现：
 *
 * + ``protected abstract init(): void;``
 * + ``public abstract get appName(): string``
 *
 * 可以选择性的重写下面的事件处理器
 *
 * + ``protected OnDocumentReady(): void``
 * + ``protected OnWindowLoad(): void``
 * + ``protected OnWindowUnload(): string``
 * + ``protected OnHashChanged(hash: string): void``
 *
 * 也可以重写下面的事件来获取当前的app的名称
 *
 * + ``protected getCurrentAppPage(): string``
*/
var Bootstrap = /** @class */ (function () {
    function Bootstrap() {
        this.status = "Sleep";
        this.hookUnload = null;
    }
    Object.defineProperty(Bootstrap.prototype, "appStatus", {
        get: function () {
            return this.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "appHookMsg", {
        get: function () {
            return this.hookUnload;
        },
        enumerable: true,
        configurable: true
    });
    Bootstrap.prototype.Init = function () {
        var _this = this;
        var vm = this;
        var currentAppName = this.getCurrentAppPage();
        var awake;
        if (Router.isCaseSensitive()) {
            awake = currentAppName == this.appName;
        }
        else {
            awake = currentAppName.toLowerCase() == this.appName.toLowerCase();
        }
        // 必须要当前的App名称和当前的页面app一致的时候这个App的运行才会被触发
        if (!awake) {
            if (TypeScript.logging.outputEverything) {
                console.log("%c[" + TypeInfo.typeof(this).class + "] Continue Sleep as: TRUE = " + currentAppName + " <> " + this.appName, "color:green;");
            }
            return;
        }
        else if (TypeScript.logging.outputEverything) {
            console.log("%c[" + TypeInfo.typeof(this).class + "] App(name:=" + this.appName + ") Init...", "color:blue;");
        }
        // attach event handlers
        $ts(function () { return _this.OnDocumentReady(); });
        // 2019-1-7 因为js是解释执行的，所以OnWindowLoad函数里面的代码之中的this，
        // 可能会被解释为window对象
        // 从而导致出现bug，所以在这里需要使用一个函数的封装来避免这个问题
        window.onload = function () { return _this.OnWindowLoad(); };
        window.onbeforeunload = function () { return _this.OnWindowUnload(); };
        window.onhashchange = function () {
            var hash = window.location.hash;
            var val = hash.substr(1);
            vm.OnHashChanged(val);
        };
        this.init();
        this.status = "Running";
    };
    /**
     * Event handler on document is ready
    */
    Bootstrap.prototype.OnDocumentReady = function () {
        // do nothing
    };
    /**
     * Event handler on Window loaded
    */
    Bootstrap.prototype.OnWindowLoad = function () {
        // do nothing
    };
    Bootstrap.prototype.OnWindowUnload = function () {
        if (!Strings.Empty(this.hookUnload, true)) {
            return this.hookUnload;
        }
    };
    Bootstrap.prototype.unhook = function () {
        this.hookUnload = null;
    };
    /**
     * Event handler on url hash link changed
    */
    Bootstrap.prototype.OnHashChanged = function (hash) {
        // do nothing
    };
    /**
     * 这个函数默认是取出url query之中的app参数字符串作为应用名称
     *
     * @returns 如果没有定义app参数，则默认是返回``/``作为名称
    */
    Bootstrap.prototype.getCurrentAppPage = function () {
        return getAllUrlParams().Item("app") || "/";
    };
    Bootstrap.prototype.toString = function () {
        return "[" + this.status + "] " + this.appName;
    };
    return Bootstrap;
}());
var Framework;
(function (Framework) {
    var Extensions;
    (function (Extensions) {
        /**
         * 确保所传递进来的参数输出的是一个序列集合对象
        */
        function EnsureCollection(data, n) {
            if (n === void 0) { n = -1; }
            return new IEnumerator(EnsureArray(data, n));
        }
        Extensions.EnsureCollection = EnsureCollection;
        /**
         * 确保随传递进来的参数所输出的是一个数组对象
         *
         * @param data 如果这个参数是一个数组，则在这个函数之中会执行复制操作
         * @param n 如果data数据序列长度不足，则会使用null进行补充，n为任何小于data长度的正实数都不会进行补充操作，
         *     相反只会返回前n个元素，如果n是负数，则不进行任何操作
        */
        function EnsureArray(data, n) {
            if (n === void 0) { n = -1; }
            var type = TypeInfo.typeof(data);
            var array;
            if (type.IsEnumerator) {
                array = data.ToArray();
            }
            else if (type.IsArray) {
                array = data.slice();
            }
            else {
                var x = data;
                if (n <= 0) {
                    array = [x];
                }
                else {
                    array = [];
                    for (var i = 0; i < n; i++) {
                        array.push(x);
                    }
                }
            }
            if (1 <= n) {
                if (n < array.length) {
                    array = array.slice(0, n);
                }
                else if (n > array.length) {
                    var len = array.length;
                    for (var i = len; i < n; i++) {
                        array.push(null);
                    }
                }
                else {
                    // n 和 array 等长，不做任何事
                }
            }
            return array;
        }
        Extensions.EnsureArray = EnsureArray;
        /**
         * Extends `from` object with members from `to`.
         *
         * > https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
         *
         * @param to If `to` is null, a deep clone of `from` is returned
        */
        function extend(from, to) {
            if (to === void 0) { to = null; }
            if (from == null || typeof from != "object")
                return from;
            if (from.constructor != Object && from.constructor != Array)
                return from;
            if (from.constructor == Date ||
                from.constructor == RegExp ||
                from.constructor == Function ||
                from.constructor == String ||
                from.constructor == Number ||
                from.constructor == Boolean)
                return new from.constructor(from);
            to = to || new from.constructor();
            for (var name in from) {
                to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
            }
            return to;
        }
        Extensions.extend = extend;
    })(Extensions = Framework.Extensions || (Framework.Extensions = {}));
})(Framework || (Framework = {}));
var TypeScript;
(function (TypeScript) {
    var warningLevel = Modes.development;
    var anyoutputLevel = Modes.debug;
    var errorOnly = Modes.production;
    /**
     * Console logging helper
    */
    var logging = /** @class */ (function () {
        function logging() {
        }
        Object.defineProperty(logging, "outputWarning", {
            /**
             * 应用程序的开发模式：只会输出框架的警告信息
            */
            get: function () {
                return $ts.mode <= warningLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(logging, "outputEverything", {
            /**
             * 框架开发调试模式：会输出所有的调试信息到终端之上
            */
            get: function () {
                return $ts.mode == anyoutputLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(logging, "outputError", {
            /**
             * 生产模式：只会输出错误信息
            */
            get: function () {
                return $ts.mode == errorOnly;
            },
            enumerable: true,
            configurable: true
        });
        logging.log = function (obj, color) {
            if (color === void 0) { color = "black"; }
            if (this.outputEverything) {
                console.log(obj);
            }
        };
        return logging;
    }());
    TypeScript.logging = logging;
})(TypeScript || (TypeScript = {}));
/// <reference path="../DOM/DOMEnumerator.ts" />
/**
 * 路由器模块
*/
var Router;
(function (Router) {
    var hashLinks;
    var webApp;
    var caseSensitive = true;
    function isCaseSensitive() {
        return caseSensitive;
    }
    Router.isCaseSensitive = isCaseSensitive;
    /**
     * 设置路由器对URL的解析是否是大小写不敏感模式，也可以在这里函数中设置参数为false，来切换为大小写敏感模式
     *
     * @param option 通过这个参数来设置是否为大小写不敏感模式？
     *
    */
    function CaseInsensitive(option) {
        if (option === void 0) { option = true; }
        caseSensitive = !option;
    }
    Router.CaseInsensitive = CaseInsensitive;
    /**
     * @param module 默认的模块是``/``，即如果服务器为php服务器的话，则默认为index.php
    */
    function AddAppHandler(app, module) {
        if (module === void 0) { module = "/"; }
        if (isNullOrUndefined(webApp)) {
            webApp = {};
        }
        if (!(module in webApp)) {
            webApp[module] = new Dictionary({});
        }
        doModule(module, function (apps) { return apps.Add(app.appName, app); });
    }
    Router.AddAppHandler = AddAppHandler;
    function doModule(module, action) {
        action(webApp[module]);
    }
    /**
     * fix for index.php, VBServerScript etc.
    */
    var indexModule = {
        "/": "general",
        "index.php": "php server",
        "index.perl": "perl server",
        "index.do": "",
        "index.jsp": "java server",
        "index.vbs": "VB server script",
        "index.vb": "VB server",
        "index.asp": "VB6 server",
        "index.aspx": "VB.NET server"
    };
    function getAppSummary(app, module) {
        if (module === void 0) { module = "/"; }
        var type = TypeInfo.typeof(app);
        var info = {
            module: module,
            appName: app.appName,
            className: type.class,
            status: app.appStatus,
            hookUnload: app.appHookMsg
        };
        return info;
    }
    Router.getAppSummary = getAppSummary;
    function RunApp(module) {
        if (module === void 0) { module = "/"; }
        if (module in webApp) {
            doModule(module, function (apps) { return apps.Select(function (app) { return app.value.Init(); }); });
        }
        else if (module == "index" || module in indexModule) {
            var runInit = false;
            for (var _i = 0, _a = Object.keys(indexModule); _i < _a.length; _i++) {
                var index = _a[_i];
                if (index in webApp) {
                    doModule(index, function (apps) { return apps.Select(function (app) { return app.value.Init(); }); });
                    runInit = true;
                    break;
                }
            }
            if (!runInit) {
                throw "Default module is not found!";
            }
        }
        else {
            throw "Module \"" + module + "\" is not exists in your web app.";
        }
        if (TypeScript.logging.outputEverything) {
            // 在console中显示table
            var summary = [];
            Object.keys(webApp).forEach(function (module) {
                doModule(module, function (apps) {
                    apps.ForEach(function (app) { return summary.push(getAppSummary(app.value, module)); });
                });
            });
            console.table(summary);
        }
    }
    Router.RunApp = RunApp;
    var routerLink = "router-link";
    function queryKey(argName) {
        return function (link) { return getAllUrlParams(link).Item(argName); };
    }
    Router.queryKey = queryKey;
    function moduleName() {
        return function (link) { return (new TypeScript.URL(link)).fileName; };
    }
    Router.moduleName = moduleName;
    /**
     * 父容器页面注册视图容器对象
    */
    function register(appId, hashKey, frameRegister) {
        if (appId === void 0) { appId = "app"; }
        if (hashKey === void 0) { hashKey = null; }
        if (frameRegister === void 0) { frameRegister = true; }
        var aLink;
        var gethashKey;
        if (!hashLinks) {
            hashLinks = new Dictionary({
                "/": "/"
            });
        }
        if (!hashKey) {
            gethashKey = function (link) { return (new TypeScript.URL(link)).fileName; };
        }
        else if (typeof hashKey == "string") {
            gethashKey = Router.queryKey(hashKey);
        }
        else {
            gethashKey = hashKey;
        }
        aLink = $ts(".router");
        aLink.attr("router-link", function (link) { return link.href; });
        aLink.attr("href", "javascript:void(0);");
        aLink.onClick(function (link, click) {
            Router.goto(link.getAttribute("router-link"), appId, gethashKey);
        });
        aLink.attr(routerLink)
            .ForEach(function (link) {
            hashLinks.Add(gethashKey(link), link);
        });
        // 假设当前的url之中有hash的话，还需要根据注册的路由配置进行跳转显示
        hashChanged(appId);
        // clientResize(appId);
    }
    Router.register = register;
    function clientResize(appId) {
        var app = $ts("#" + appId);
        var frame = $ts("#" + appId + "-frame");
        var size = DOM.clientSize();
        if (!app) {
            if (TypeScript.logging.outputWarning) {
                console.warn("[#" + appId + "] not found!");
            }
        }
        else {
            app.style.width = size[0].toString();
            app.style.height = size[1].toString();
            frame.width = size[0].toString();
            frame.height = size[1].toString();
        }
    }
    /**
     * 根据当前url之中的hash进行相应的页面的显示操作
    */
    function hashChanged(appId) {
        var hash = TypeScript.URL.WindowLocation().hash;
        var url = hashLinks.Item(hash);
        if (url) {
            if (url == "/") {
                // 跳转到主页，重新刷新页面？
                window.location.hash = "";
                window.location.reload(true);
            }
            else {
                $ts("#" + appId).innerHTML = HttpHelpers.GET(url);
            }
        }
    }
    function navigate(link, stack, appId, hashKey) {
        var frame = $ts("#" + appId);
        frame.innerHTML = HttpHelpers.GET(link);
        Router.register(appId, hashKey, false);
        window.location.hash = hashKey(link);
    }
    /**
     * 当前的堆栈环境是否是最顶层的堆栈？
    */
    function IsTopWindowStack() {
        return parent && (parent.location.pathname == window.location.pathname);
    }
    Router.IsTopWindowStack = IsTopWindowStack;
    /**
     * 因为link之中可能存在查询参数，所以必须要在web服务器上面测试
    */
    function goto(link, appId, hashKey, stack) {
        if (stack === void 0) { stack = null; }
        if (!Router.IsTopWindowStack()) {
            parent.Router.goto(link, appId, hashKey, parent);
        }
        else if (stack) {
            // 没有parent了，已经到达最顶端了
            navigate(link, stack, appId, hashKey);
        }
        else {
            navigate(link, window, appId, hashKey);
        }
    }
    Router.goto = goto;
})(Router || (Router = {}));
/**
 * 序列之中的元素下标的操作方法集合
*/
var Which;
(function (Which) {
    /**
     * 查找出所给定的逻辑值集合之中的所有true的下标值
    */
    function Is(booleans) {
        if (Array.isArray(booleans)) {
            booleans = new IEnumerator(booleans);
        }
        return booleans
            .Select(function (flag, i) {
            return {
                flag: flag, index: i
            };
        })
            .Where(function (t) { return t.flag; })
            .Select(function (t) { return t.index; });
    }
    Which.Is = Is;
    /**
     * 默认的通用类型的比较器对象
    */
    var DefaultCompares = /** @class */ (function () {
        function DefaultCompares() {
            /**
             * 一个用于比较通用类型的数值转换器对象
            */
            this.as_numeric = null;
        }
        DefaultCompares.prototype.compares = function (a, b) {
            if (!this.as_numeric) {
                this.as_numeric = DataExtensions.AsNumeric(a);
                if (!this.as_numeric) {
                    this.as_numeric = DataExtensions.AsNumeric(b);
                }
            }
            if (!this.as_numeric) {
                // a 和 b 都是null或者undefined
                // 认为这两个空值是相等的
                // 则this.as_numeric会在下一个循环之中被赋值
                return 0;
            }
            else {
                return this.as_numeric(a) - this.as_numeric(b);
            }
        };
        DefaultCompares.default = function () {
            return new DefaultCompares().compares;
        };
        return DefaultCompares;
    }());
    Which.DefaultCompares = DefaultCompares;
    /**
     * 查找出序列之中最大的元素的序列下标编号
     *
     * @param x 所给定的数据序列
     * @param compare 默认是将x序列之中的元素转换为数值进行大小的比较的
    */
    function Max(x, compare) {
        if (compare === void 0) { compare = DefaultCompares.default(); }
        var xMax = null;
        var iMax = 0;
        for (var i = 0; i < x.Count; i++) {
            if (compare(x.ElementAt(i), xMax) > 0) {
                // x > xMax
                xMax = x.ElementAt(i);
                iMax = i;
            }
        }
        return iMax;
    }
    Which.Max = Max;
    /**
     * 查找出序列之中最小的元素的序列下标编号
     *
     * @param x 所给定的数据序列
     * @param compare 默认是将x序列之中的元素转换为数值进行大小的比较的
    */
    function Min(x, compare) {
        if (compare === void 0) { compare = DefaultCompares.default(); }
        return Max(x, function (a, b) { return -compare(a, b); });
    }
    Which.Min = Min;
})(Which || (Which = {}));
var TsLinq;
(function (TsLinq) {
    /**
     * 性能计数器
    */
    var Benchmark = /** @class */ (function () {
        function Benchmark() {
            this.start = (new Date).getTime();
            this.lastCheck = this.start;
        }
        Benchmark.prototype.Tick = function () {
            var now = (new Date).getTime();
            var checkpoint = new CheckPoint();
            checkpoint.start = this.start;
            checkpoint.time = now;
            checkpoint.sinceFromStart = now - this.start;
            checkpoint.sinceLastCheck = now - this.lastCheck;
            this.lastCheck = now;
            return checkpoint;
        };
        return Benchmark;
    }());
    TsLinq.Benchmark = Benchmark;
    /**
     * 单位都是毫秒
    */
    var CheckPoint = /** @class */ (function () {
        function CheckPoint() {
        }
        Object.defineProperty(CheckPoint.prototype, "elapsedMilisecond", {
            /**
             * 获取从``time``到当前时间所流逝的毫秒计数
            */
            get: function () {
                return (new Date).getTime() - this.time;
            },
            enumerable: true,
            configurable: true
        });
        return CheckPoint;
    }());
    TsLinq.CheckPoint = CheckPoint;
})(TsLinq || (TsLinq = {}));
var Cookies;
(function (Cookies) {
    /**
     * Cookie 不存在，函数会返回空字符串
    */
    function getCookie(cookiename) {
        // Get name followed by anything except a semicolon
        var cookie = document.cookie;
        var cookiestring = RegExp("" + cookiename + "[^;]+").exec(cookie);
        var value;
        // Return everything after the equal sign, 
        // or an empty string if the cookie name not found
        if (!!cookiestring) {
            value = cookiestring.toString().replace(/^[^=]+./, "");
        }
        else {
            value = "";
        }
        return decodeURIComponent(value);
    }
    Cookies.getCookie = getCookie;
    /**
     * 将cookie设置为过期，进行cookie的删除操作
    */
    function delCookie(name) {
        var cval = getCookie(name);
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        if (cval != null) {
            var expires = exp.toGMTString();
            expires = name + "=" + cval + ";expires=" + expires;
            document.cookie = expires;
        }
    }
    Cookies.delCookie = delCookie;
})(Cookies || (Cookies = {}));
/**
 * Binary tree implements
*/
var algorithm;
(function (algorithm) {
    var BTree;
    (function (BTree) {
        /**
         * 用于进行数据分组所需要的最基础的二叉树数据结构
         *
         * ``{key => value}``
        */
        var binaryTree = /** @class */ (function () {
            /**
             * 构建一个二叉树对象
             *
             * @param comparer 这个函数指针描述了如何进行两个对象之间的比较操作，如果这个函数参数使用默认值的话
             *                 则只能够针对最基本的数值，逻辑变量进行操作
            */
            function binaryTree(comparer) {
                if (comparer === void 0) { comparer = function (a, b) {
                    var x = DataExtensions.as_numeric(a);
                    var y = DataExtensions.as_numeric(b);
                    return x - y;
                }; }
                this.compares = comparer;
            }
            /**
             * 向这个二叉树对象之中添加一个子节点
            */
            binaryTree.prototype.add = function (term, value) {
                if (value === void 0) { value = null; }
                var np = this.root;
                var cmp = 0;
                if (!np) {
                    // 根节点是空的，则将当前的term作为根节点
                    this.root = new BTree.node(term, value);
                    return;
                }
                while (np) {
                    cmp = this.compares(term, np.key);
                    if (cmp == 0) {
                        // this node is existed
                        // value replace??
                        np.value = value;
                        break;
                    }
                    else if (cmp < 0) {
                        if (np.left) {
                            np = np.left;
                        }
                        else {
                            // np is a leaf node?
                            // add at here
                            np.left = new BTree.node(term, value);
                            break;
                        }
                    }
                    else {
                        if (np.right) {
                            np = np.right;
                        }
                        else {
                            np.right = new BTree.node(term, value);
                            break;
                        }
                    }
                }
            };
            /**
             * 根据key值查找一个节点，然后获取该节点之中与key所对应的值
             *
             * @returns 如果这个函数返回空值，则表示可能未找到目标子节点
            */
            binaryTree.prototype.find = function (term) {
                var np = this.root;
                var cmp = 0;
                while (np) {
                    cmp = this.compares(term, np.key);
                    if (cmp == 0) {
                        return np.value;
                    }
                    else if (cmp < 0) {
                        np = np.left;
                    }
                    else {
                        np = np.right;
                    }
                }
                // not exists
                return null;
            };
            /**
             * 将这个二叉树对象转换为一个节点的数组
            */
            binaryTree.prototype.ToArray = function () {
                return BTree.binaryTreeExtensions.populateNodes(this.root);
            };
            /**
             * 将这个二叉树对象转换为一个Linq查询表达式所需要的枚举器类型
            */
            binaryTree.prototype.AsEnumerable = function () {
                return new IEnumerator(this.ToArray());
            };
            return binaryTree;
        }());
        BTree.binaryTree = binaryTree;
    })(BTree = algorithm.BTree || (algorithm.BTree = {}));
})(algorithm || (algorithm = {}));
var algorithm;
(function (algorithm) {
    var BTree;
    (function (BTree) {
        /**
         * data extension module for binary tree nodes data sequence
        */
        var binaryTreeExtensions;
        (function (binaryTreeExtensions) {
            /**
             * Convert a binary tree object as a node array.
            */
            function populateNodes(tree) {
                var out = [];
                visitInternal(tree, out);
                return out;
            }
            binaryTreeExtensions.populateNodes = populateNodes;
            function visitInternal(tree, out) {
                // 20180929 为什么会存在undefined的节点呢？
                if (isNullOrUndefined(tree)) {
                    if (TypeScript.logging.outputWarning) {
                        console.warn(tree);
                    }
                    return;
                }
                else {
                    out.push(tree);
                }
                if (tree.left) {
                    visitInternal(tree.left, out);
                }
                if (tree.right) {
                    visitInternal(tree.right, out);
                }
            }
        })(binaryTreeExtensions = BTree.binaryTreeExtensions || (BTree.binaryTreeExtensions = {}));
    })(BTree = algorithm.BTree || (algorithm.BTree = {}));
})(algorithm || (algorithm = {}));
var algorithm;
(function (algorithm) {
    var BTree;
    (function (BTree) {
        /**
         * A binary tree node.
        */
        var node = /** @class */ (function () {
            function node(key, value, left, right) {
                if (value === void 0) { value = null; }
                if (left === void 0) { left = null; }
                if (right === void 0) { right = null; }
                this.key = key;
                this.left = left;
                this.right = right;
                this.value = value;
            }
            node.prototype.toString = function () {
                return this.key.toString();
            };
            return node;
        }());
        BTree.node = node;
    })(BTree = algorithm.BTree || (algorithm.BTree = {}));
})(algorithm || (algorithm = {}));
/**
 * How to Encode and Decode Strings with Base64 in JavaScript
 *
 * https://gist.github.com/ncerminara/11257943
 *
 * In base64 encoding, the character set is ``[A-Z, a-z, 0-9, and + /]``.
 * If the rest length is less than 4, the string is padded with ``=``
 * characters.
 *
 * (符号``=``只是用来进行字符串的长度填充使用的，因为base64字符串的长度应该总是4的倍数)
*/
var Base64;
(function (Base64) {
    var base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/g;
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    /**
     * 简单的检测一下所给定的字符串是否是有效的base64字符串
    */
    function isValidBase64String(text) {
        if (text && (text.length % 4 == 0)) {
            return base64Pattern.test(text);
        }
        else {
            return false;
        }
    }
    Base64.isValidBase64String = isValidBase64String;
    /**
     * 将任意文本编码为base64字符串
    */
    function encode(text) {
        var base64 = [];
        var n, r, i, s, o, u, a;
        var f = 0;
        text = Base64.utf8_encode(text);
        while (f < text.length) {
            n = text.charCodeAt(f++);
            r = text.charCodeAt(f++);
            i = text.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }
            base64.push(keyStr.charAt(s));
            base64.push(keyStr.charAt(o));
            base64.push(keyStr.charAt(u));
            base64.push(keyStr.charAt(a));
        }
        return base64.join("");
    }
    Base64.encode = encode;
    /**
     * 将base64字符串解码为普通的文本字符串
    */
    function decode(base64) {
        var text = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        base64 = base64.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < base64.length) {
            s = keyStr.indexOf(base64.charAt(f++));
            o = keyStr.indexOf(base64.charAt(f++));
            u = keyStr.indexOf(base64.charAt(f++));
            a = keyStr.indexOf(base64.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            text = text + String.fromCharCode(n);
            if (u != 64) {
                text = text + String.fromCharCode(r);
            }
            if (a != 64) {
                text = text + String.fromCharCode(i);
            }
        }
        text = Base64.utf8_decode(text);
        return text;
    }
    Base64.decode = decode;
    /**
     * 将文本转换为utf8编码的文本字符串
    */
    function utf8_encode(text) {
        var chars = [];
        text = text.replace(/rn/g, "n");
        for (var n = 0; n < text.length; n++) {
            var r = text.charCodeAt(n);
            if (r < 128) {
                chars.push(String.fromCharCode(r));
            }
            else if (r > 127 && r < 2048) {
                chars.push(String.fromCharCode(r >> 6 | 192));
                chars.push(String.fromCharCode(r & 63 | 128));
            }
            else {
                chars.push(String.fromCharCode(r >> 12 | 224));
                chars.push(String.fromCharCode(r >> 6 & 63 | 128));
                chars.push(String.fromCharCode(r & 63 | 128));
            }
        }
        return chars.join("");
    }
    Base64.utf8_encode = utf8_encode;
    /**
     * 将utf8编码的文本转换为原来的文本
    */
    function utf8_decode(text) {
        var t = [];
        var n = 0;
        var r = 0;
        var c2 = 0;
        var c3 = 0;
        while (n < text.length) {
            r = text.charCodeAt(n);
            if (r < 128) {
                t.push(String.fromCharCode(r));
                n++;
            }
            else if (r > 191 && r < 224) {
                c2 = text.charCodeAt(n + 1);
                t.push(String.fromCharCode((r & 31) << 6 | c2 & 63));
                n += 2;
            }
            else {
                c2 = text.charCodeAt(n + 1);
                c3 = text.charCodeAt(n + 2);
                t.push(String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63));
                n += 3;
            }
        }
        return t.join("");
    }
    Base64.utf8_decode = utf8_decode;
})(Base64 || (Base64 = {}));
/**
 * 可能对unicode的支持不是很好，推荐只用来压缩ASCII字符串
*/
var LZW;
(function (LZW) {
    /**
     * LZW-compress a string
    */
    function encode(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    }
    LZW.encode = encode;
    /**
     * Decompress an LZW-encoded string
    */
    function decode(s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }
    LZW.decode = decode;
})(LZW || (LZW = {}));
var TsLinq;
(function (TsLinq) {
    /**
     * 调用堆栈之中的某一个栈片段信息
    */
    var StackFrame = /** @class */ (function () {
        function StackFrame() {
        }
        StackFrame.prototype.toString = function () {
            return this.caller + " [as " + this.memberName + "](" + this.file + ":" + this.line + ":" + this.column + ")";
        };
        StackFrame.Parse = function (line) {
            var frame = new StackFrame();
            var file = StackFrame.getFileName(line);
            var caller = line.replace(file, "").trim().substr(3);
            file = file.substr(1, file.length - 2);
            if (caller.indexOf("/") > -1 || caller.indexOf(":") > -1) {
                // 没有替换成功，任然是一个文件路径，则可能
                // 是html文档之中的一个最开始的函数调用
                // 是没有caller的
                caller = "<HTML\\Document>";
            }
            var position = $ts(file.match(/([:]\d+){2}$/m)[0].split(":"));
            var posStrLen = (position.Select(function (s) { return s.length; }).Sum() + 2);
            var location = From(position)
                .Where(function (s) { return s.length > 0; })
                .Select(function (x) { return Strings.Val(x); })
                .ToArray();
            frame.file = file.substr(0, file.length - posStrLen);
            var alias = caller.match(/\[.+\]/);
            var memberName = (!alias || alias.length == 0) ? null : alias[0];
            if (memberName) {
                caller = caller
                    .substr(0, caller.length - memberName.length)
                    .trim();
                frame.memberName = memberName
                    .substr(3, memberName.length - 4)
                    .trim();
            }
            else {
                var t = caller.split(".");
                frame.memberName = t[t.length - 1];
            }
            frame.caller = caller;
            frame.line = location[0];
            frame.column = location[1];
            return frame;
        };
        StackFrame.getFileName = function (line) {
            var matches = line.match(/\(.+\)/);
            if (!matches || matches.length == 0) {
                // 2018-09-14 可能是html文件之中
                return "(" + line.substr(6).trim() + ")";
            }
            else {
                return matches[0];
            }
        };
        return StackFrame;
    }());
    TsLinq.StackFrame = StackFrame;
})(TsLinq || (TsLinq = {}));
var Levenshtein;
(function (Levenshtein) {
    var defaultScore = {
        insert: function (x) { return 1; },
        delete: function (x) { return 1; },
        substitute: function (s, t) {
            if (s == t) {
                return 0;
            }
            else {
                return 1;
            }
        }
    };
    function DistanceMatrix(source, target, score) {
        if (score === void 0) { score = defaultScore; }
        var src = Strings.ToCharArray(source, true);
        var tar = Strings.ToCharArray(target, true);
        if (src.length == 0 && tar.length == 0) {
            return [[0]];
        }
        if (src.length == 0) {
            return [[$ts(tar).Sum(function (c) { return score.insert(c); })]];
        }
        else if (tar.length == 0) {
            return [[$ts(src).Sum(function (c) { return score.delete(c); })]];
        }
        var ns = src.length + 1;
        var nt = tar.length + 1;
        var d = new Matrix(ns, nt, 0.0);
        d.column(0, Enumerable.Range(0, ns - 1));
        d.row(0, Enumerable.Range(0, nt - 1));
        for (var j = 1; j < nt; j++) {
            for (var i = 1; i < ns; i++) {
                d.M(i, j, Enumerable.Min(d.M(i - 1, j) + score.delete(src[i - 1]), d.M(i, j - 1) + score.insert(tar[j - 1]), d.M(i - 1, j - 1) + score.substitute(src[i - 1], tar[j - 1])));
            }
        }
        return d.ToArray(false);
    }
    Levenshtein.DistanceMatrix = DistanceMatrix;
    function ComputeDistance(source, target, score) {
        if (score === void 0) { score = defaultScore; }
        var d = DistanceMatrix(source, target, score);
        var distance = d[d.length - 1][d[0].length - 1];
        return distance;
    }
    Levenshtein.ComputeDistance = ComputeDistance;
})(Levenshtein || (Levenshtein = {}));
var StringBuilder = /** @class */ (function () {
    /**
     * @param newLine 换行符的文本，默认为纯文本格式，也可以指定为html格式的换行符``<br />``
    */
    function StringBuilder(str, newLine) {
        if (str === void 0) { str = null; }
        if (newLine === void 0) { newLine = "\n"; }
        if (!str) {
            this.buffer = "";
        }
        else if (typeof str == "string") {
            this.buffer = "" + str;
        }
        else {
            this.buffer = "" + str.buffer;
        }
        this.newLine = newLine;
    }
    Object.defineProperty(StringBuilder.prototype, "Length", {
        /**
         * 返回得到当前的缓冲区的字符串数据长度大小
        */
        get: function () {
            return this.buffer.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 向当前的缓冲之中添加目标文本
    */
    StringBuilder.prototype.Append = function (text) {
        this.buffer = this.buffer + text;
        return this;
    };
    /**
     * 向当前的缓冲之中添加目标文本病在最末尾添加一个指定的换行符
    */
    StringBuilder.prototype.AppendLine = function (text) {
        if (text === void 0) { text = ""; }
        return this.Append(text + this.newLine);
    };
    StringBuilder.prototype.toString = function () {
        return this.buffer + "";
    };
    return StringBuilder;
}());
// namespace DOM {
// 2018-10-15
// 为了方便书写代码，在其他脚本之中添加变量类型申明，在这里就不进行命名空间的包裹了
/**
 * TypeScript脚本之中的HTML节点元素的类型代理接口
*/
var HTMLTsElement = /** @class */ (function () {
    function HTMLTsElement(node) {
        this.node = node instanceof HTMLElement ?
            node :
            node.node;
    }
    Object.defineProperty(HTMLTsElement.prototype, "HTMLElement", {
        /**
         * 可以从这里获取得到原生的``HTMLElement``对象用于操作
        */
        get: function () {
            return this.node;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 这个拓展函数总是会将节点中的原来的内容清空，然后显示html函数参数
     * 所给定的内容
     *
     * @param html 当这个参数为一个无参数的函数的时候，主要是用于生成一个比较复杂的文档节点而使用的;
     *    如果为字符串文本类型，则是直接将文本当作为HTML代码赋值给当前的这个节点对象的innerHTML属性;
    */
    HTMLTsElement.prototype.display = function (html) {
        if (!html) {
            this.HTMLElement.innerHTML = "";
        }
        else if (typeof html == "string" || typeof html == "number" || typeof html == "boolean") {
            this.HTMLElement.innerHTML = html.toString();
        }
        else {
            var node;
            var parent = this.HTMLElement;
            if (typeof html == "function") {
                node = html();
            }
            else {
                node = html instanceof HTMLTsElement ?
                    html.HTMLElement :
                    html;
            }
            parent.innerHTML = "";
            parent.appendChild(node);
        }
        return this;
    };
    /**
     * Clear all of the contents in current html element node.
    */
    HTMLTsElement.prototype.clear = function () {
        this.HTMLElement.innerHTML = "";
        return this;
    };
    HTMLTsElement.prototype.text = function (innerText) {
        this.HTMLElement.innerText = innerText;
        return this;
    };
    HTMLTsElement.prototype.addClass = function (className) {
        var node = this.HTMLElement;
        if (!node.classList.contains(className)) {
            node.classList.add(className);
        }
        return this;
    };
    HTMLTsElement.prototype.removeClass = function (className) {
        var node = this.HTMLElement;
        if (node.classList.contains(className)) {
            node.classList.remove(className);
        }
        return this;
    };
    /**
     * 在当前的HTML文档节点之中添加一个新的文档节点
    */
    HTMLTsElement.prototype.append = function (node) {
        if (node instanceof HTMLTsElement) {
            this.HTMLElement.appendChild(node.HTMLElement);
        }
        else if (node instanceof HTMLElement) {
            this.HTMLElement.appendChild(node);
        }
        else {
            this.HTMLElement.appendChild(node());
        }
        return this;
    };
    /**
     * 将css的display属性值设置为block用来显示当前的节点
    */
    HTMLTsElement.prototype.show = function () {
        this.HTMLElement.style.display = "block";
        return this;
    };
    /**
     * 将css的display属性值设置为none来隐藏当前的节点
    */
    HTMLTsElement.prototype.hide = function () {
        this.HTMLElement.style.display = "none";
        return this;
    };
    return HTMLTsElement;
}());
/**
 * 在这里对原生的html节点进行拓展
*/
var TypeExtensions;
(function (TypeExtensions) {
    /**
     * 在原生节点模式之下对输入的给定的节点对象添加拓展方法
     *
     * 向HTML节点对象的原型定义之中拓展新的方法和成员属性
     * 这个函数的输出在ts之中可能用不到，主要是应用于js脚本
     * 编程之中
     *
     * @param node 当查询失败的时候是空值
    */
    function Extends(node) {
        var obj = node;
        if (isNullOrUndefined(node)) {
            return null;
        }
        var extendsNode = new HTMLTsElement(node);
        /**
         * 这个拓展函数总是会将节点中的原来的内容清空，然后显示html函数参数
         * 所给定的内容
        */
        obj.display = function (html) {
            extendsNode.display(html);
            return node;
        };
        obj.show = function () {
            extendsNode.show();
            return node;
        };
        obj.hide = function () {
            extendsNode.hide();
            return node;
        };
        obj.addClass = function (name) {
            extendsNode.addClass(name);
            return node;
        };
        obj.removeClass = function (name) {
            extendsNode.removeClass(name);
            return node;
        };
        obj.CType = function () {
            return node;
        };
        obj.clear = function () {
            node.innerHTML = "";
            return node;
        };
        obj.selects = function (cssSelector) { return Internal.Handlers.stringEval.select(cssSelector, node); };
        // 用这个方法可以很方便的从现有的节点进行转换
        // 也可以直接使用new进行构造
        obj.asExtends = extendsNode;
        obj.asImage = node;
        obj.asInput = node;
        return node;
    }
    TypeExtensions.Extends = Extends;
})(TypeExtensions || (TypeExtensions = {}));
var Internal;
(function (Internal) {
    var Arguments = /** @class */ (function () {
        function Arguments() {
        }
        /**
         * 在创建新的节点的时候，会有一个属性值的赋值过程，
         * 该赋值过程会需要使用这个函数来过滤Arguments的属性值，否则该赋值过程会将Arguments
         * 里面的属性名也进行赋值，可能会造成bug
        */
        Arguments.nameFilter = function (args) {
            var _this = this;
            return From(Object.keys(args))
                .Where(function (name) { return _this.ArgumentNames.indexOf(name) == -1; })
                .ToArray();
        };
        Arguments.Default = function () {
            return {
                caseInSensitive: false,
                nativeModel: true,
                defaultValue: "",
                context: window
            };
        };
        //#endregion
        Arguments.ArgumentNames = Object.keys(Arguments.Default());
        return Arguments;
    }());
    Internal.Arguments = Arguments;
})(Internal || (Internal = {}));
var CanvasHelper;
(function (CanvasHelper) {
    var innerCanvas;
    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     *
     */
    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = innerCanvas || (innerCanvas = $ts("<canvas>"));
        var context = canvas.getContext("2d");
        var metrics;
        context.font = font;
        metrics = context.measureText(text);
        return metrics.width;
    }
    CanvasHelper.getTextWidth = getTextWidth;
    /**
     * found this trick at http://talideon.com/weblog/2005/02/detecting-broken-images-js.cfm
    */
    function imageOk(img) {
        "use strict";
        // During the onload event, IE correctly identifies any images that
        // weren't downloaded as not complete. Others should too. Gecko-based
        // browsers act like NS4 in that they report this incorrectly.
        if (!img.complete) {
            return false;
        }
        // However, they do have two very useful properties: naturalWidth and
        // naturalHeight. These give the true size of the image. If it failed
        // to load, either of these should be zero.
        if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
            return false;
        }
        // No other way of checking: assume it's ok.
        return true;
    }
    CanvasHelper.imageOk = imageOk;
    /**
     * @param size [width, height]
    */
    function createCanvas(size, id, title, display) {
        "use strict";
        if (display === void 0) { display = "block"; }
        // size the canvas
        var canvas = $ts("<canvas>", {
            width: size[0],
            height: size[1],
            id: id,
            title: title,
            style: "display: " + display + ";"
        });
        // check for canvas support before attempting anything
        if (!canvas.getContext) {
            return null;
        }
        var ctx = canvas.getContext('2d');
        // check for html5 text drawing support
        if (!supportsText(ctx)) {
            return null;
        }
        return canvas;
    }
    CanvasHelper.createCanvas = createCanvas;
    function supportsText(ctx) {
        if (!ctx.fillText) {
            return false;
        }
        if (!ctx.measureText) {
            return false;
        }
        return true;
    }
    CanvasHelper.supportsText = supportsText;
    var fontSize = /** @class */ (function () {
        function fontSize() {
            this.sizes = [];
        }
        fontSize.prototype.toString = function () {
            return fontSize.css(this);
        };
        fontSize.css = function (size) {
            if (size.point) {
                return size.point + "pt";
            }
            else if (size.percent) {
                return size.percent + "%";
            }
            else if (size.em) {
                return size.em + "em";
            }
            else {
                return size.pixel.toString();
            }
        };
        return fontSize;
    }());
    CanvasHelper.fontSize = fontSize;
    var CSSFont = /** @class */ (function () {
        function CSSFont() {
        }
        CSSFont.prototype.apply = function (node) {
            CSSFont.applyCSS(node, this);
        };
        CSSFont.applyCSS = function (node, font) {
            node.style.fontFamily = font.fontName;
            node.style.fontSize = fontSize.css(font.size);
        };
        return CSSFont;
    }());
    CanvasHelper.CSSFont = CSSFont;
})(CanvasHelper || (CanvasHelper = {}));
var CanvasHelper;
(function (CanvasHelper) {
    var saveSvgAsPng;
    (function (saveSvgAsPng) {
        saveSvgAsPng.xlink = "http://www.w3.org/1999/xlink";
        function isElement(obj) {
            return obj instanceof HTMLElement || obj instanceof SVGElement;
        }
        saveSvgAsPng.isElement = isElement;
        function requireDomNode(el) {
            if (!isElement(el)) {
                throw new Error('an HTMLElement or SVGElement is required; got ' + el);
            }
            else {
                return el;
            }
        }
        saveSvgAsPng.requireDomNode = requireDomNode;
        /**
         * 判断所给定的url指向的资源是否是来自于外部域的资源？
        */
        function isExternal(url) {
            return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
        }
        saveSvgAsPng.isExternal = isExternal;
        function inlineImages(el, callback) {
            requireDomNode(el);
            var images = el.querySelectorAll('image');
            var left = images.length;
            var checkDone = function (count) {
                if (count === 0) {
                    callback();
                }
            };
            checkDone(left);
            for (var i = 0; i < images.length; i++) {
                left = renderInlineImage(images[i], left, checkDone);
            }
        }
        saveSvgAsPng.inlineImages = inlineImages;
        function renderInlineImage(image, left, checkDone) {
            var href = image.getAttributeNS(saveSvgAsPng.xlink, "href");
            if (href) {
                if (typeof href != "string") {
                    href = href.value;
                }
                if (isExternal(href)) {
                    if (TypeScript.logging.outputWarning) {
                        console.warn("Cannot render embedded images linking to external hosts: " + href);
                    }
                    return;
                }
            }
            var canvas = $ts('<canvas>');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.crossOrigin = "anonymous";
            href = href || image.getAttribute('href');
            if (href) {
                img.src = href;
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    image.setAttributeNS(saveSvgAsPng.xlink, "href", canvas.toDataURL('image/png'));
                    left--;
                    checkDone(left);
                };
                img.onerror = function () {
                    console.error("Could not load " + href);
                    left--;
                    checkDone(left);
                };
            }
            else {
                left--;
                checkDone(left);
            }
            return left;
        }
        /**
         * 获取得到width或者height的值
        */
        function getDimension(el, clone, dim) {
            var v = (el.viewBox && el.viewBox.baseVal && el.viewBox.baseVal[dim]) ||
                (clone.getAttribute(dim) !== null && !clone.getAttribute(dim).match(/%$/) && parseInt(clone.getAttribute(dim))) ||
                el.getBoundingClientRect()[dim] ||
                parseInt(clone.style[dim]) ||
                parseInt(window.getComputedStyle(el).getPropertyValue(dim));
            if (typeof v === 'undefined' || v === null) {
                return 0;
            }
            else {
                var val = parseFloat(v);
                return isNaN(val) ? 0 : val;
            }
        }
        saveSvgAsPng.getDimension = getDimension;
        function reEncode(data) {
            data = encodeURIComponent(data);
            data = data.replace(/%([0-9A-F]{2})/g, function (match, p1) {
                var c = String.fromCharCode(('0x' + p1));
                return c === '%' ? '%25' : c;
            });
            return decodeURIComponent(data);
        }
        saveSvgAsPng.reEncode = reEncode;
    })(saveSvgAsPng = CanvasHelper.saveSvgAsPng || (CanvasHelper.saveSvgAsPng = {}));
})(CanvasHelper || (CanvasHelper = {}));
var CanvasHelper;
(function (CanvasHelper) {
    var saveSvgAsPng;
    (function (saveSvgAsPng) {
        saveSvgAsPng.xmlns = "http://www.w3.org/2000/xmlns/";
        /**
         * ##### 2018-10-12 XMl标签必须要一开始就出现，否则会出现错误
         *
         * error on line 2 at column 14: XML declaration allowed only at the start of the document
        */
        saveSvgAsPng.doctype = "<?xml version=\"1.0\" standalone=\"no\"?>\n            <!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" [<!ENTITY nbsp \"&#160;\">]>";
        /**
         * https://github.com/exupero/saveSvgAsPng
        */
        var Encoder = /** @class */ (function () {
            function Encoder() {
            }
            Encoder.prepareSvg = function (el, options, cb) {
                if (options === void 0) { options = new saveSvgAsPng.Options(); }
                saveSvgAsPng.requireDomNode(el);
                options.scale = options.scale || 1;
                options.responsive = options.responsive || false;
                saveSvgAsPng.inlineImages(el, function () { return Encoder.doInlineImages(el, options, cb); });
            };
            Encoder.doInlineImages = function (el, options, cb) {
                var outer = $ts("<div>");
                var clone = el.cloneNode(true);
                var width, height;
                if (el.tagName == 'svg') {
                    width = options.width || saveSvgAsPng.getDimension(el, clone, 'width');
                    height = options.height || saveSvgAsPng.getDimension(el, clone, 'height');
                }
                else if (el.getBBox) {
                    var box = el.getBBox();
                    width = box.x + box.width;
                    height = box.y + box.height;
                    clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));
                    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.appendChild(clone);
                    clone = svg;
                }
                else {
                    console.error('Attempted to render non-SVG element', el);
                    return;
                }
                clone.setAttribute("version", "1.1");
                if (!clone.getAttribute('xmlns')) {
                    clone.setAttributeNS(saveSvgAsPng.xmlns, "xmlns", "http://www.w3.org/2000/svg");
                }
                if (!clone.getAttribute('xmlns:xlink')) {
                    clone.setAttributeNS(saveSvgAsPng.xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
                }
                if (options.responsive) {
                    clone.removeAttribute('width');
                    clone.removeAttribute('height');
                    clone.setAttribute('preserveAspectRatio', 'xMinYMin meet');
                }
                else {
                    clone.setAttribute("width", (width * options.scale).toString());
                    clone.setAttribute("height", (height * options.scale).toString());
                }
                clone.setAttribute("viewBox", [
                    options.left || 0,
                    options.top || 0,
                    width,
                    height
                ].join(" "));
                var fos = clone.querySelectorAll('foreignObject > *');
                for (var i = 0; i < fos.length; i++) {
                    if (!fos[i].getAttribute('xmlns')) {
                        fos[i].setAttributeNS(saveSvgAsPng.xmlns, "xmlns", "http://www.w3.org/1999/xhtml");
                    }
                }
                outer.appendChild(clone);
                // In case of custom fonts we need to fetch font first, and then inline
                // its url into data-uri format (encode as base64). That's why style
                // processing is done asynchonously. Once all inlining is finshed
                // cssLoadedCallback() is called.
                saveSvgAsPng.styles.doStyles(el, options, cssLoadedCallback);
                function cssLoadedCallback(css) {
                    // here all fonts are inlined, so that we can render them properly.
                    var s = $ts('<style>', {
                        type: 'text/css'
                    }).display("<![CDATA[\n" + css + "\n]]>");
                    var defs = $ts('<defs>').display(s);
                    clone.insertBefore(defs, clone.firstChild);
                    if (cb) {
                        var outHtml = outer.innerHTML;
                        outHtml = outHtml.replace(/NS\d+:href/gi, 'xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href');
                        cb(outHtml, width, height);
                    }
                }
            };
            Encoder.svgAsDataUri = function (el, options, cb) {
                if (cb === void 0) { cb = null; }
                this.prepareSvg(el, options, function (svg) {
                    var uri = 'data:image/svg+xml;base64,' + window.btoa(saveSvgAsPng.reEncode(saveSvgAsPng.doctype + svg));
                    if (cb) {
                        cb(uri);
                    }
                });
            };
            /**
             * 将svg转换为base64 data uri
            */
            Encoder.convertToPng = function (src, w, h, options) {
                var canvas = $ts('<canvas>', {
                    width: w,
                    height: h
                });
                var context = canvas.getContext('2d');
                if (options.canvg) {
                    options.canvg(canvas, src);
                }
                else {
                    context.drawImage(src, 0, 0);
                }
                if (options.backgroundColor) {
                    context.globalCompositeOperation = 'destination-over';
                    context.fillStyle = options.backgroundColor;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                // base64 uri
                var png;
                try {
                    png = canvas.toDataURL(options.encoderType, options.encoderOptions);
                }
                catch (e) {
                    // 20181013 在typescript之中还不支持SecurityError??
                    // (typeof SecurityError !== 'undefined' && e instanceof SecurityError) || 
                    if (e.name == "SecurityError") {
                        console.error("Rendered SVG images cannot be downloaded in this browser.");
                        return;
                    }
                    else {
                        throw e;
                    }
                }
                return png;
            };
            Encoder.svgAsPngUri = function (el, options, cb) {
                if (options === void 0) { options = new saveSvgAsPng.Options(); }
                saveSvgAsPng.requireDomNode(el);
                options.encoderType = options.encoderType || 'image/png';
                options.encoderOptions = options.encoderOptions || 0.8;
                var convertToPng = function (src, w, h) {
                    cb(Encoder.convertToPng(src, w, h, options));
                };
                if (options.canvg) {
                    this.prepareSvg(el, options, convertToPng);
                }
                else {
                    this.svgAsDataUri(el, options, function (uri) {
                        var image = new Image();
                        image.onload = function () {
                            convertToPng(image, image.width, image.height);
                        };
                        image.onerror = function () {
                            console.error('There was an error loading the data URI as an image on the following SVG\n', window.atob(uri.slice(26)), '\n', "Open the following link to see browser's diagnosis\n", uri);
                        };
                        image.src = uri;
                    });
                }
            };
            Encoder.saveSvg = function (el, name, options) {
                saveSvgAsPng.requireDomNode(el);
                options = options || {};
                this.svgAsDataUri(el, options, function (uri) { return DOM.download(name, uri); });
            };
            /**
             * 将指定的SVG节点保存为png图片
             *
             * @param svg 需要进行保存为图片的svg节点的对象实例或者对象的节点id值
             * @param name 所保存的文件名
             * @param options 配置参数，直接留空使用默认值就好了
            */
            Encoder.saveSvgAsPng = function (svg, name, options) {
                if (options === void 0) { options = saveSvgAsPng.Options.Default(); }
                if (typeof svg == "string") {
                    svg = $ts(svg);
                    saveSvgAsPng.requireDomNode(svg);
                }
                else {
                    saveSvgAsPng.requireDomNode(svg);
                }
                this.svgAsPngUri(svg, options, function (uri) { return DOM.download(name, uri); });
            };
            return Encoder;
        }());
        saveSvgAsPng.Encoder = Encoder;
    })(saveSvgAsPng = CanvasHelper.saveSvgAsPng || (CanvasHelper.saveSvgAsPng = {}));
})(CanvasHelper || (CanvasHelper = {}));
var CanvasHelper;
(function (CanvasHelper) {
    var saveSvgAsPng;
    (function (saveSvgAsPng) {
        var Options = /** @class */ (function () {
            function Options() {
            }
            Options.Default = function () {
                return {
                    encoderType: "image/png",
                    encoderOptions: 0.8,
                    scale: 1,
                    responsive: false,
                    left: 0,
                    top: 0
                };
            };
            return Options;
        }());
        saveSvgAsPng.Options = Options;
        var styles = /** @class */ (function () {
            function styles() {
            }
            styles.doStyles = function (el, options, cssLoadedCallback) {
                var css = "";
                // each font that has extranl link is saved into queue, and processed
                // asynchronously
                var fontsQueue = [];
                var sheets = document.styleSheets;
                for (var i = 0; i < sheets.length; i++) {
                    var rules;
                    try {
                        rules = sheets[i].cssRules;
                    }
                    catch (e) {
                        if (TypeScript.logging.outputWarning) {
                            console.warn("Stylesheet could not be loaded: " + sheets[i].href);
                        }
                        continue;
                    }
                    if (rules != null) {
                        css += this.processCssRules(el, rules, options, sheets[i].href, fontsQueue);
                    }
                }
                // Now all css is processed, it's time to handle scheduled fonts
                this.processFontQueue(fontsQueue, css, cssLoadedCallback);
            };
            styles.processCssRules = function (el, rules, options, sheetHref, fontsQueue) {
                var css = "";
                for (var j = 0, match; j < rules.length; j++, match = null) {
                    var rule = rules[j];
                    if (typeof (rule.style) == "undefined") {
                        continue;
                    }
                    var selectorText;
                    try {
                        selectorText = rule.selectorText;
                    }
                    catch (err) {
                        if (TypeScript.logging.outputWarning) {
                            console.warn("The following CSS rule has an invalid selector: \"" + rule + "\"", err);
                        }
                    }
                    try {
                        if (selectorText) {
                            match = el.querySelector(selectorText) || el.parentNode.querySelector(selectorText);
                        }
                    }
                    catch (err) {
                        if (TypeScript.logging.outputWarning) {
                            console.warn("Invalid CSS selector \"" + selectorText + "\"", err);
                        }
                    }
                    if (match) {
                        var selector = options.selectorRemap ? options.selectorRemap(rule.selectorText) : rule.selectorText;
                        var cssText = options.modifyStyle ? options.modifyStyle(rule.style.cssText) : rule.style.cssText;
                        css += selector + " { " + cssText + " }\n";
                    }
                    else if (rule.cssText.match(/^@font-face/)) {
                        // below we are trying to find matches to external link. E.g.
                        // @font-face {
                        //   // ...
                        //   src: local('Abel'), url(https://fonts.gstatic.com/s/abel/v6/UzN-iejR1VoXU2Oc-7LsbvesZW2xOQ-xsNqO47m55DA.woff2);
                        // }
                        //
                        // This regex will save extrnal link into first capture group
                        var fontUrlRegexp = /url\(["']?(.+?)["']?\)/;
                        // TODO: This needs to be changed to support multiple url declarations per font.
                        var fontUrlMatch = rule.cssText.match(fontUrlRegexp);
                        var externalFontUrl = (fontUrlMatch && fontUrlMatch[1]) || '';
                        var fontUrlIsDataURI = externalFontUrl.match(/^data:/);
                        if (fontUrlIsDataURI) {
                            // We should ignore data uri - they are already embedded
                            externalFontUrl = '';
                        }
                        if (externalFontUrl === 'about:blank') {
                            // no point trying to load this
                            externalFontUrl = '';
                        }
                        if (externalFontUrl) {
                            // okay, we are lucky. We can fetch this font later
                            //handle url if relative
                            if (externalFontUrl["startsWith"]('../')) {
                                externalFontUrl = sheetHref + '/../' + externalFontUrl;
                            }
                            else if (externalFontUrl["startsWith"]('./')) {
                                externalFontUrl = sheetHref + '/.' + externalFontUrl;
                            }
                            fontsQueue.push({
                                text: rule.cssText,
                                // Pass url regex, so that once font is downladed, we can run `replace()` on it
                                fontUrlRegexp: fontUrlRegexp,
                                format: styles.getFontMimeTypeFromUrl(externalFontUrl),
                                url: externalFontUrl
                            });
                        }
                        else {
                            // otherwise, use previous logic
                            css += rule.cssText + '\n';
                        }
                    }
                }
                return css;
            };
            styles.processFontQueue = function (queue, css, cssLoadedCallback) {
                var style = this;
                if (queue.length > 0) {
                    // load fonts one by one until we have anything in the queue:
                    var font = queue.pop();
                    processNext(font);
                }
                else {
                    // no more fonts to load.
                    cssLoadedCallback(css);
                }
                /**
                 * 在这里通过网络下载字体文件，然后序列化为base64字符串，最后以URI的形式写入到SVG之中
                */
                function processNext(font) {
                    // TODO: This could benefit from caching.
                    var oReq = new XMLHttpRequest();
                    oReq.addEventListener('load', fontLoaded);
                    oReq.addEventListener('error', transferFailed);
                    oReq.addEventListener('abort', transferFailed);
                    oReq.open('GET', font.url);
                    oReq.responseType = 'arraybuffer';
                    oReq.send();
                    function fontLoaded() {
                        // TODO: it may be also worth to wait until fonts are fully loaded before
                        // attempting to rasterize them. (e.g. use https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet )
                        var fontBits = oReq.response;
                        var fontInBase64 = DataExtensions.arrayBufferToBase64(fontBits);
                        updateFontStyle(font, fontInBase64);
                    }
                    function transferFailed(e) {
                        if (TypeScript.logging.outputWarning) {
                            console.warn('Failed to load font from: ' + font.url);
                            console.warn(e);
                        }
                        css += font.text + '\n';
                        style.processFontQueue(queue, css, cssLoadedCallback);
                    }
                    function updateFontStyle(font, fontInBase64) {
                        var dataUrl = "url(\"data:" + font.format + ";base64," + fontInBase64 + "\")";
                        css += font.text.replace(font.fontUrlRegexp, dataUrl) + '\n';
                        // schedule next font download on next tick.
                        setTimeout(function () {
                            style.processFontQueue(queue, css, cssLoadedCallback);
                        }, 0);
                    }
                }
            };
            styles.getFontMimeTypeFromUrl = function (fontUrl) {
                var extensions = Object.keys(supportedFormats);
                for (var i = 0; i < extensions.length; ++i) {
                    var extension = extensions[i];
                    // TODO: This is not bullet proof, it needs to handle edge cases...
                    if (fontUrl.indexOf('.' + extension) > 0) {
                        return supportedFormats[extension];
                    }
                }
                this.warnFontNotSupport(fontUrl);
                return 'application/octet-stream';
            };
            styles.warnFontNotSupport = function (fontUrl) {
                // If you see this error message, you probably need to update code above.
                console.warn("Unknown font format for " + fontUrl + "; Fonts may not be working correctly");
            };
            return styles;
        }());
        saveSvgAsPng.styles = styles;
        var supportedFormats = {
            'woff2': 'font/woff2',
            'woff': 'font/woff',
            'otf': 'application/x-font-opentype',
            'ttf': 'application/x-font-ttf',
            'eot': 'application/vnd.ms-fontobject',
            'sfnt': 'application/font-sfnt',
            'svg': 'image/svg+xml'
        };
        var font = /** @class */ (function () {
            function font() {
            }
            return font;
        }());
    })(saveSvgAsPng = CanvasHelper.saveSvgAsPng || (CanvasHelper.saveSvgAsPng = {}));
})(CanvasHelper || (CanvasHelper = {}));
/// <reference path="../../Data/Encoder/Base64.ts" />
var HttpHelpers;
(function (HttpHelpers) {
    /**
     * Javascript动态加载帮助函数
    */
    var Imports = /** @class */ (function () {
        /**
         * @param modules javascript脚本文件的路径集合
         * @param onErrorResumeNext On Error Resume Next Or Just Break
        */
        function Imports(modules, onErrorResumeNext, echo) {
            if (onErrorResumeNext === void 0) { onErrorResumeNext = false; }
            if (echo === void 0) { echo = true; }
            this.i = 0;
            /**
             * 当脚本执行的时候抛出异常的时候是否继续执行下去？
            */
            this.onErrorResumeNext = false;
            this.echo = false;
            if (typeof modules == "string") {
                this.jsURL = [modules];
            }
            else {
                this.jsURL = modules;
            }
            this.errors = [];
            this.onErrorResumeNext = onErrorResumeNext;
            this.echo = echo;
        }
        Imports.prototype.nextScript = function () {
            var url = this.jsURL[this.i++];
            return url;
        };
        /**
         * 开始进行异步的脚本文件加载操作
         *
         * @param callback 在所有指定的脚本文件都完成了加载操作之后所调用的异步回调函数
        */
        Imports.prototype.doLoad = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = DoNothing; }
            var url = this.nextScript();
            if (Strings.Empty(url, true)) {
                // 已经加载完所有的脚本了
                // 执行callback
                callback();
            }
            else {
                HttpHelpers.GetAsyn(url, function (script, code) { return _this.doExec(url, script, code, callback); });
            }
        };
        /**
         * 完成向服务器的数据请求操作之后
         * 加载代码文本
        */
        Imports.prototype.doExec = function (url, script, code, callback) {
            switch (code) {
                case 200:
                    try {
                        eval.apply(window, [script]);
                    }
                    catch (ex) {
                        if (this.onErrorResumeNext) {
                            if (TypeScript.logging.outputWarning) {
                                console.warn(url);
                                console.warn(ex);
                            }
                            this.errors.push(url);
                        }
                        else {
                            throw ex;
                        }
                    }
                    finally {
                        if (this.echo) {
                            console.log("script loaded: ", url);
                        }
                    }
                    break;
                default:
                    if (this.echo) {
                        console.error("ERROR: script not loaded: ", url);
                    }
                    this.errors.push(url);
            }
            this.doLoad(callback);
        };
        /**
         * @param script 这个函数可以支持base64字符串格式的脚本的动态加载
         * @param context 默认是添加在当前文档窗口环境之中
        */
        Imports.doEval = function (script, callback, context) {
            if (context === void 0) { context = window; }
            if (Base64.isValidBase64String(script)) {
                script = Base64.decode(script);
            }
            eval.apply(context, [script]);
            if (callback) {
                callback();
            }
        };
        /**
         * 得到相对于当前路径而言的目标脚本全路径
        */
        Imports.getFullPath = function (url) {
            var location = $ts.location.path;
            if (url.charAt(0) == "/") {
                // 是一个绝对路径
                return url;
            }
            else {
            }
            console.log(location);
        };
        return Imports;
    }());
    HttpHelpers.Imports = Imports;
})(HttpHelpers || (HttpHelpers = {}));
var HttpHelpers;
(function (HttpHelpers) {
    HttpHelpers.contentTypes = {
        form: "multipart/form-data",
        /**
         * 请注意：如果是php服务器，则$_POST很有可能不会自动解析json数据，导致$_POST变量为空数组
         * 则这个时候会需要你在php文件之中手动处理一下$_POST变量：
         *
         * ```php
         * $json  = file_get_contents("php://input");
         * $_POST = json_decode($json, true);
         * ```
        */
        json: "application/json",
        text: "text/plain",
        /**
         * 传统的表单post格式
        */
        www: "application/x-www-form-urlencoded"
    };
    function measureContentType(obj) {
        if (obj instanceof FormData) {
            return HttpHelpers.contentTypes.form;
        }
        else if (typeof obj == "string") {
            return HttpHelpers.contentTypes.text;
        }
        else {
            // object类型都会被转换为json发送回服务器
            return HttpHelpers.contentTypes.json;
        }
    }
    HttpHelpers.measureContentType = measureContentType;
    /**
     * 这个函数只会返回200成功代码的响应内容，对于其他的状态代码都会返回null
     * (这个函数是同步方式的)
    */
    function GET(url) {
        var request = new XMLHttpRequest();
        // `false` makes the request synchronous
        request.open('GET', url, false);
        request.send(null);
        if (request.status === 200) {
            return request.responseText;
        }
        else {
            return null;
        }
    }
    HttpHelpers.GET = GET;
    /**
     * 使用异步调用的方式进行数据的下载操作
     *
     * @param callback ``callback(http.responseText, http.status)``
    */
    function GetAsyn(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.onreadystatechange = function () {
            var contentType = this.getResponseHeader('content-type');
            if (isNullOrUndefined(contentType)) {
                contentType = this.getResponseHeader('Content-Type');
            }
            if (http.readyState == 4) {
                callback(http.response || http.responseText, http.status, contentType);
            }
        };
        http.send(null);
    }
    HttpHelpers.GetAsyn = GetAsyn;
    function POST(url, postData, callback) {
        var http = new XMLHttpRequest();
        var data = postData.data;
        if (postData.type == HttpHelpers.contentTypes.json) {
            if (typeof data != "string") {
                data = JSON.stringify(data);
            }
        }
        http.open('POST', url, true);
        // Send the proper header information along with the request
        if (postData.sendContentType) {
            http.setRequestHeader('Content-Type', postData.type);
        }
        // Call a function when the state changes.
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                callback(http.responseText, http.status);
            }
        };
        http.send(data);
    }
    HttpHelpers.POST = POST;
    /**
     * 使用multipart form类型的数据进行文件数据的上传操作
     *
     * @param url 函数会通过POST方式将文件数据上传到这个url所指定的服务器资源位置
     *
    */
    function UploadFile(url, postData, fileName, callback) {
        if (fileName === void 0) { fileName = null; }
        var data = new FormData();
        if (postData instanceof File) {
            data.append("filename", postData.name);
            fileName = fileName || postData.name;
        }
        else {
            data.append("filename", fileName);
        }
        data.append("File", postData, fileName);
        HttpHelpers.POST(url, {
            type: HttpHelpers.contentTypes.form,
            data: data
        }, callback);
    }
    HttpHelpers.UploadFile = UploadFile;
    /**
     * 在这个数据包对象之中应该包含有
     *
     * + ``type``属性，用来设置``Content-type``
     * + ``data``属性，可以是``formData``或者一个``object``
    */
    var PostData = /** @class */ (function () {
        function PostData() {
            this.sendContentType = true;
        }
        PostData.prototype.toString = function () {
            return this.type;
        };
        return PostData;
    }());
    HttpHelpers.PostData = PostData;
})(HttpHelpers || (HttpHelpers = {}));
//# sourceMappingURL=linq.js.map