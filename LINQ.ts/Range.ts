
/**
 * 一个数值范围
*/
class NumericRange implements DoubleRange {

    /**
     * 这个数值范围的最小值
    */
    public min: number;
    /**
     * 这个数值范围的最大值
    */
    public max: number;

    public constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    /**
     * 判断目标数值是否在当前的这个数值范围之内
    */
    public IsInside(x: number): boolean {
        return x >= this.min && x <= this.max;
    }

    /**
     * 从一个数值序列之中创建改数值序列的值范围
    */
    public static Create(numbers: number[]): NumericRange {
        var seq = From(numbers);
        var min: number = seq.Min();
        var max: number = seq.Max();

        return new NumericRange(min, max);
    }

    public toString(): string {
        return `[${this.min}, ${this.max}]`;
    }
}