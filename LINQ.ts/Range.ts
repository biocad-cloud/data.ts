class DoubleRange {

    public Min: number;
    public Max: number;

    public constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    public toString(): string {
        return `[${this.min}, ${this.max}]`;
    }
}