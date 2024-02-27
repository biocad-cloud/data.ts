namespace TypeScript.ColorManager {

    /**
     * convert an integer number to hex string
     * 
    */
    export function toHex(n: number) {
        var hex = n.toString(16);
        while (hex.length < 2) { hex = "0" + hex; }
        return hex;
    }

    export function cl(x: any) {
        TypeScript.logging.log(x, TypeScript.ConsoleColors.DarkYellow);
    }

    export function w3trim(x: string) {
        return x.replace(/^\s+|\s+$/g, '');
    }

    /**
     * check of the given char is one of the possible hex char?
    */
    export function isHex(x: string) {
        return ('0123456789ABCDEFabcdef'.indexOf(x) > -1);
    }

    export function color(
        red: number = 0,
        blue: number = 0,
        green: number = 0,
        hue: number = 0,
        sat: number = 0,
        opacity: number = 1,
        whiteness: number = 0,
        lightness: number = 0,
        blackness: number = 0,
        cyan: number = 0,
        magenta: number = 0,
        yellow: number = 0,
        black: number = 0,
        ncol: string = "R"): w3color {

        const color: w3color = new w3color();
        color.red = red;
        color.green = green;
        color.blue = blue;
        color.hue = hue;
        color.sat = sat;
        color.lightness = lightness;
        color.whiteness = whiteness;
        color.blackness = blackness;
        color.cyan = cyan;
        color.magenta = magenta;
        color.yellow = yellow;
        color.black = black;
        color.ncol = ncol;
        color.opacity = opacity;
        color.valid = true;
        return color;
    }
}