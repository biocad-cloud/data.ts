namespace TypeScript.ColorManager {

    /**
     * w3color.js ver.1.18 by w3schools.com (Do not remove this line)
    */
    export class w3color implements IW3color {

        public red: number = 0;
        public blue: number = 0;
        public green: number = 0;
        public hue: number = 0;
        public sat: number = 0;
        public opacity: number = 1;
        public whiteness: number = 0;
        public lightness: number = 0;
        public blackness: number = 0;
        public cyan: number = 0;
        public magenta: number = 0;
        public yellow: number = 0;
        public black: number = 0;
        public ncol: string = "R";
        public valid: boolean = false;

        public static get emptyObject(): w3color {
            return color();
        }

        public constructor(color: string | IW3color = null, elmnt: HTMLElement = null) {
            if (!isNullOrUndefined(color)) {
                // make value copy to current color object
                if (typeof color == "string") {
                    this.attachValues(toColorObject(color));
                } else {
                    this.attachValues(color);
                }
            }

            if (!isNullOrUndefined(elmnt)) {
                elmnt.style.backgroundColor = this.toRgbString();
            }
        }

        toRgbString() {
            return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        }
        toRgbaString() {
            return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.opacity + ")";
        }
        toHwbString() {
            return "hwb(" + this.hue + ", " + Math.round(this.whiteness * 100) + "%, " + Math.round(this.blackness * 100) + "%)";
        }
        toHwbStringDecimal() {
            return "hwb(" + this.hue + ", " + this.whiteness + ", " + this.blackness + ")";
        }
        toHwbaString() {
            return "hwba(" + this.hue + ", " + Math.round(this.whiteness * 100) + "%, " + Math.round(this.blackness * 100) + "%, " + this.opacity + ")";
        }
        toHslString() {
            return "hsl(" + this.hue + ", " + Math.round(this.sat * 100) + "%, " + Math.round(this.lightness * 100) + "%)";
        }
        toHslStringDecimal() {
            return "hsl(" + this.hue + ", " + this.sat + ", " + this.lightness + ")";
        }
        toHslaString() {
            return "hsla(" + this.hue + ", " + Math.round(this.sat * 100) + "%, " + Math.round(this.lightness * 100) + "%, " + this.opacity + ")";
        }
        toCmykString() {
            return "cmyk(" + Math.round(this.cyan * 100) + "%, " + Math.round(this.magenta * 100) + "%, " + Math.round(this.yellow * 100) + "%, " + Math.round(this.black * 100) + "%)";
        }
        toCmykStringDecimal() {
            return "cmyk(" + this.cyan + ", " + this.magenta + ", " + this.yellow + ", " + this.black + ")";
        }
        toNcolString() {
            return this.ncol + ", " + Math.round(this.whiteness * 100) + "%, " + Math.round(this.blackness * 100) + "%";
        }
        toNcolStringDecimal() {
            return this.ncol + ", " + this.whiteness + ", " + this.blackness;
        }
        toNcolaString() {
            return this.ncol + ", " + Math.round(this.whiteness * 100) + "%, " + Math.round(this.blackness * 100) + "%, " + this.opacity;
        }
        toName() {
            var r, g, b, colorhexs = getColorArr('hexs');
            for (let i = 0; i < colorhexs.length; i++) {
                r = parseInt(colorhexs[i].substr(0, 2), 16);
                g = parseInt(colorhexs[i].substr(2, 2), 16);
                b = parseInt(colorhexs[i].substr(4, 2), 16);
                if (this.red == r && this.green == g && this.blue == b) {
                    return getColorArr('names')[i];
                }
            }
            return "";
        }

        /**
         * to html hex color value: #XXXXXX
        */
        toHexString() {
            var r = toHex(this.red);
            var g = toHex(this.green);
            var b = toHex(this.blue);
            return "#" + r + g + b;
        }
        toRgb() {
            return { r: this.red, g: this.green, b: this.blue, a: this.opacity };
        }
        toHsl() {
            return { h: this.hue, s: this.sat, l: this.lightness, a: this.opacity };
        }
        toHwb() {
            return { h: this.hue, w: this.whiteness, b: this.blackness, a: this.opacity };
        }
        toCmyk() {
            return { c: this.cyan, m: this.magenta, y: this.yellow, k: this.black, a: this.opacity };
        }
        toNcol() {
            return { ncol: this.ncol, w: this.whiteness, b: this.blackness, a: this.opacity };
        }
        isDark(n) {
            var m = (n || 128);
            return (((this.red * 299 + this.green * 587 + this.blue * 114) / 1000) < m);
        }
        saturate(n) {
            var x, rgb, color;
            x = (n / 100 || 0.1);
            this.sat += x;
            if (this.sat > 1) { this.sat = 1; }
            rgb = hslToRgb(this.hue, this.sat, this.lightness);
            color = colorObject(rgb, this.opacity, this.hue, this.sat);
            this.attachValues(color);
        }
        desaturate(n) {
            var x, rgb, color;
            x = (n / 100 || 0.1);
            this.sat -= x;
            if (this.sat < 0) { this.sat = 0; }
            rgb = hslToRgb(this.hue, this.sat, this.lightness);
            color = colorObject(rgb, this.opacity, this.hue, this.sat);
            this.attachValues(color);
        }
        lighter(n) {
            var x, rgb, color;
            x = (n / 100 || 0.1);
            this.lightness += x;
            if (this.lightness > 1) { this.lightness = 1; }
            rgb = hslToRgb(this.hue, this.sat, this.lightness);
            color = colorObject(rgb, this.opacity, this.hue, this.sat);
            this.attachValues(color);
        }
        darker(n) {
            var x, rgb, color;
            x = (n / 100 || 0.1);
            this.lightness -= x;
            if (this.lightness < 0) { this.lightness = 0; }
            rgb = hslToRgb(this.hue, this.sat, this.lightness);
            color = colorObject(rgb, this.opacity, this.hue, this.sat);
            this.attachValues(color);
        }

        /**
         * copy values from another color object to current object
        */
        public attachValues(color: IW3color) {
            this.red = color.red;
            this.green = color.green;
            this.blue = color.blue;
            this.hue = color.hue;
            this.sat = color.sat;
            this.lightness = color.lightness;
            this.whiteness = color.whiteness;
            this.blackness = color.blackness;
            this.cyan = color.cyan;
            this.magenta = color.magenta;
            this.yellow = color.yellow;
            this.black = color.black;
            this.ncol = color.ncol;
            this.opacity = color.opacity;
            this.valid = color.valid;
        }
    };
}