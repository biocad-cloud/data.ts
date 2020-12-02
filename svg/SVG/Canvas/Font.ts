namespace Canvas {

    export class Font implements ICSSStyle {

        constructor(
            public family: string,
            public size: any = "12px",
            public bold: boolean = false,
            public italic: boolean = false) {
        }

        public Styling(node: SVGElement): SVGElement {
            let styles = [];

            if (this.bold) styles.push("bold");
            if (this.italic) styles.push("italic");

            node.style.fontFamily = this.family;
            node.style.fontSize = this.size;
            node.style.fontStyle = styles.join(" ");

            return node;
        }

        public CSSStyle(): string {
            let styles = [];

            if (this.bold) styles.push("bold");
            if (this.italic) styles.push("italic");

            return `font: ${styles.join(" ")} ${this.size} "${this.family}"`;
        }
    }
}