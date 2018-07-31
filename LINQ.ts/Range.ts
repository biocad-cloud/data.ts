class NumericRange implements DoubleRange {

    public min: number;
    public max: number;

    public constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    public IsInside(x: number): boolean {
        return x >= this.min && x <= this.max;
    }

    public static Create(min: number, max: number): NumericRange {
        return new NumericRange(min, max);
    }

    public toString(): string {
        return `[${this.min}, ${this.max}]`;
    }
}