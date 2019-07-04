abstract class SvgChart {

    public size: [number, number];
    public margin: Canvas.Margin;

    public constructor(
        size: Canvas.Size | number[] = [960, 600],
        margin: Canvas.Margin = <Canvas.Margin>{
            top: 20, right: 20, bottom: 30, left: 40
        }) {

        if (!Array.isArray(size)) {
            this.size = [size.width, size.height];
        }

        this.margin = margin;
    }
}