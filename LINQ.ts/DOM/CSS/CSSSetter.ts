namespace DOM.CSS.Setter {

    export function css(node: HTMLElement, style: string) {
        setStyle(node, parseStylesheet(style));
    }

    export function setStyle(node: HTMLElement, style: NamedValue<string>[]) {
        TypeScript.logging.log(style);
    }
}