declare class option {
    baseUrl: string;
    breaks: boolean;
    gfm: boolean;
    headerIds: boolean;
    headerPrefix: string;
    highlight: (code: string, lang: string, callback?: highlightCallback) => string;
    langPrefix: string;
    mangle: boolean;
    pedantic: boolean;
    renderer: Renderer;
    sanitize: boolean;
    sanitizer?: (text: string) => string;
    silent: boolean;
    smartLists: boolean;
    smartypants: boolean;
    tables: boolean;
    xhtml: boolean;
    block: block;
    inline: inline;
    static readonly Defaults: option;
}
interface highlightCallback {
    (err: string, code: number | string): void;
}
declare module helpers {
    module escape {
        const escapeTest: RegExp;
        const escapeReplace: RegExp;
        const replacements: {
            '&': string;
            '<': string;
            '>': string;
            '"': string;
            "'": string;
        };
        const escapeTestNoEncode: RegExp;
        const escapeReplaceNoEncode: RegExp;
        function doescape(html: string, encode: boolean): string;
        /**
         * explicitly match decimal, hex, and named HTML entities
        */
        function unescape(html: string): string;
    }
}
declare module helpers {
    function edit(regex: RegExp | string, opt?: string): IEdits;
    function cleanUrl(sanitize: boolean, base: string, href: string): string;
    function resolveUrl(base: string, href: string): string;
    function merge(obj: {}, ...args: {}[]): {};
    function splitCells(tableRow: string, count?: number): string[];
    /**
     * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
     * ``/c*$/`` is vulnerable to REDOS.
     *
     * @param invert Remove suffix of non-c chars instead. Default falsey.
    */
    function rtrim(str: string, c: string, invert?: boolean): string;
}
declare class Grammer {
    newline: RegExp;
    code: RegExp;
    fences: RegExp;
    hr: RegExp;
    heading: RegExp;
    nptable: RegExp;
    blockquote: RegExp;
    list: RegExp;
    html: RegExp;
    def: RegExp;
    table: RegExp;
    lheading: RegExp;
    paragraph: RegExp;
    text: RegExp;
    br: RegExp;
    em: RegExp;
    del: RegExp;
    escape: RegExp;
    nolink: RegExp;
    strong: RegExp;
    tag: RegExp;
    autolink: RegExp;
    link: RegExp;
    reflink: RegExp;
    url: RegExp;
}
interface IEdits {
    replace(name: string | RegExp, val: RegExp | string): IEdits;
    getRegex(): RegExp;
}
interface Irule {
    fences: RegExp;
    paragraph: RegExp;
    heading: RegExp;
}
interface Itoken {
    type?: string;
    depth?: number;
    text?: string;
    escaped?: boolean;
    lang?: string;
    align?: string[];
    header?: string[];
    cells?: string[];
    ordered?: boolean;
    start?: number;
    loose?: boolean;
    checked?: boolean;
    task?: boolean;
}
/**
 * Block-Level Grammar
*/
declare class block extends Grammer {
    _label: RegExp;
    _title: RegExp;
    _tag: string;
    static _comment: RegExp;
    static bullet: RegExp;
    item: RegExp;
    /**
     * Normal Block Grammar
    */
    normal: block;
    /**
     * GFM Block Grammar
     */
    gfm: block;
    /**
     * GFM + Tables Block Grammar
     */
    tables: block;
    /**
     * Pedantic grammar
     */
    pedantic: block;
    constructor();
    private static blockHtml;
}
/**
 * Inline-Level Grammar
*/
declare class inline extends Grammer {
    _punctuation: string;
    _escapes: RegExp;
    _scheme: RegExp;
    _email: RegExp;
    _attribute: RegExp;
    _label: RegExp;
    _href: RegExp;
    _title: RegExp;
    /**
     * Normal Inline Grammar
    */
    normal: inline;
    /**
     * Pedantic Inline Grammar
    */
    pedantic: inline;
    /**
     * GFM Inline Grammar
    */
    gfm: inline;
    /**
     * GFM + Line Breaks Inline Grammar
    */
    breaks: inline;
    constructor();
    private static inlineTag;
}
declare abstract class component {
    options: option;
    constructor(opt: option);
}
/**
 * Inline Lexer & Compiler
*/
declare class inlineLexer extends component {
    private renderer;
    private links;
    private inLink;
    private inRawBlock;
    constructor(links: string[], options?: option);
    /**
     * Expose Inline Rules
     */
    rules: inline;
    /**
     * Static Lexing/Compiling Method
    */
    static Output(src: string, links: string[], options: option): string;
    /**
     * Lexing/Compiling
     */
    output(src: string): string;
    escapes(text: string): string;
    /**
     * Compile Link
     */
    outputLink(cap: any, link: any): string;
    /**
     * Smartypants Transformations
     */
    smartypants(text: any): any;
    /**
     * Mangle Links
     */
    mangle(text: any): any;
}
/**
 * Block Lexer
*/
declare class Lexer {
    private options;
    private tokens;
    private rules;
    constructor(options: option);
    /**
     * Preprocessing
    */
    lex(src: string): Itoken[];
    /**
     * Lexing
    */
    token(src: string, top: any): Itoken[];
}
/**
 * Parsing & Compiling
*/
declare class parser extends component {
    private renderer;
    private tokens;
    private inline;
    private token;
    private inlineText;
    constructor(options?: option);
    /**
     * Parse Loop
    */
    parse(src: Itoken[]): string;
    /**
     * Next Token
    */
    next(): Itoken;
    /**
     * Preview Next Token
    */
    peek(): 0 | Itoken;
    /**
     * Parse Text Tokens
    */
    parseText(): string;
    /**
     * Parse Current Token
    */
    tok(): string;
}
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
*/
declare const marked: Imarked;
declare module helpers {
    /**
     * 模拟正则表达式，因为正则表达式没有空操作，所以会需要用这个来进行模拟
    */
    interface Inoop {
        (): void;
        /**
         * Execute regexp
        */
        exec: Inoop;
    }
    /**
     * No operation: this regexp object do nothing.
    */
    const noop: Inoop;
}
interface Imarked {
    options: option;
    (src: string, opt: option, callback: markedCallback): any;
    setOptions(opt: option): void;
    parse: Imarked;
}
interface markedCallback {
    (err: string, output?: string): void;
}
declare class htmlRenderer extends component implements Renderer {
    constructor();
    html(text: string): string;
    text(text: string): string;
    code(code: string, infostring: any, escaped: boolean): string;
    blockquote(quote: any): string;
    heading(text: string, level: number, raw: string): string;
    hr(): "<hr/>\n" | "<hr>\n";
    list(body: any, ordered: any, start: any): string;
    listitem(text: string): string;
    checkbox(checked: any): string;
    paragraph(text: string): string;
    table(header: any, body: any): string;
    tablerow(content: any): string;
    tablecell(content: any, flags: any): string;
    strong(text: any): string;
    em(text: any): string;
    codespan(text: any): string;
    br(): "<br/>" | "<br>";
    del(text: any): string;
    link(href: any, title: any, text: any): any;
    static hrefSolver: (href: string) => string;
    image(href: any, title: any, text: any): any;
}
interface Renderer {
    options: option;
    strong(text: string): string;
    em(text: string): string;
    codespan(text: string): string;
    code(text: string, lang: string, escaped: boolean): string;
    del(text: string): string;
    text(text: string): string;
    image(href: string, title: string, text: string): string;
    link(href: string, title: string, text: string): string;
    br(): string;
    hr(): string;
    paragraph(text: string): string;
    html(text: string): string;
    heading(text: string, depth: number, unescape: string): string;
    tablerow(cell: string): string;
    tablecell(text: string, opt: {
        header: boolean;
        align: string;
    }): string;
    table(thead: string, tbody: string): string;
    blockquote(text: string): string;
    list(body: string, ordered: boolean, start: number): string;
    checkbox(checked: boolean): string;
    listitem(text: string): string;
}
/**
 * returns only the textual part of the token
 * no need for block level renderers
*/
declare class textRenderer implements Renderer {
    options: option;
    code(text: string, lang: string, escaped: boolean): string;
    hr(): string;
    html(text: string): string;
    heading(text: string, depth: number, unescape: string): string;
    tablerow(cell: string): string;
    tablecell(text: string, opt: {
        header: boolean;
        align: string;
    }): string;
    table(thead: string, tbody: string): string;
    blockquote(text: string): string;
    list(body: string, ordered: boolean, start: number): string;
    checkbox(checked: boolean): string;
    listitem(text: string): string;
    paragraph(text: string): string;
    strong(text: string): string;
    em(text: string): string;
    codespan(text: string): string;
    del(text: string): string;
    text(text: string): string;
    image(href: string, title: string, text: string): string;
    link(href: string, title: string, text: string): string;
    br(): string;
}
