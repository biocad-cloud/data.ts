/// <reference path="../SvgUtils.ts"/>

/**
 * SVG画布元素
*/
namespace Canvas {

    /**
     * CSS style object model
    */
    export interface ICSSStyle {

        /**
         * Apply CSS style to a given svg node element
         * 
         * @param node a given svg document node object
        */
        Styling(node: SVGElement): SVGElement;
        /**
         * Generate css style string value from this 
         * css style object model.
        */
        CSSStyle(): string;
    }

    /**
     * The object location data model 
    */
    export class Point {

        public x: number;
        public y: number;

        public constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public toString(): string {
            return `[${this.x}, ${this.y}]`;
        }
    }

    export class Size {

        public width: number;
        public height: number;

        public constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        public toString(): string {
            return `[${this.width}, ${this.height}]`;
        }
    }

    /**
     * 表示一个二维平面上的矩形区域
    */
    export class Rectangle {

        public left: number;
        public top: number;
        public width: number;
        public height: number;

        public constructor(x: number, y: number, width: number, height: number) {
            this.left = x;
            this.top = y;
            this.width = width;
            this.height = height;
        }

        public Location(): Point {
            return new Point(this.left, this.top);
        }

        public Size(): Size {
            return new Size(this.width, this.height);
        }

        public toString(): string {
            return `Size: ${this.Size().toString()} @ ${this.Location().toString()}`;
        }
    }
}