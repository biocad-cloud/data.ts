var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var markedjs;
(function (markedjs) {
    var option = /** @class */ (function () {
        function option() {
            this.debug = false;
        }
        Object.defineProperty(option, "Defaults", {
            get: function () {
                return {
                    baseUrl: null,
                    breaks: false,
                    gfm: true,
                    headerIds: true,
                    headerPrefix: '',
                    highlight: null,
                    langPrefix: 'language-',
                    mangle: true,
                    pedantic: false,
                    renderer: null,
                    sanitize: false,
                    sanitizer: null,
                    silent: false,
                    smartLists: false,
                    smartypants: false,
                    tables: true,
                    xhtml: false,
                    debug: false,
                    // grammers
                    inline: new markedjs.inline(),
                    block: new markedjs.block()
                };
            },
            enumerable: true,
            configurable: true
        });
        return option;
    }());
    markedjs.option = option;
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    var helpers;
    (function (helpers) {
        var escape;
        (function (escape) {
            escape.escapeTest = /[&<>"']/;
            escape.escapeReplace = /[&<>"']/g;
            escape.replacements = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
            escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
            function doescape(html, encode) {
                if (encode) {
                    if (escape.escapeTest.test(html)) {
                        return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
                    }
                }
                else {
                    if (escape.escapeTestNoEncode.test(html)) {
                        return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
                    }
                }
                return html;
            }
            escape.doescape = doescape;
            /**
             * explicitly match decimal, hex, and named HTML entities
            */
            function unescape(html) {
                return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function (_, n) {
                    n = n.toLowerCase();
                    if (n === 'colon')
                        return ':';
                    if (n.charAt(0) === '#') {
                        return n.charAt(1) === 'x'
                            ? String.fromCharCode(parseInt(n.substring(2), 16))
                            : String.fromCharCode(+n.substring(1));
                    }
                    return '';
                });
            }
            escape.unescape = unescape;
        })(escape = helpers.escape || (helpers.escape = {}));
    })(helpers = markedjs.helpers || (markedjs.helpers = {}));
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    var helpers;
    (function (helpers) {
        function edit(regex, opt) {
            if (opt === void 0) { opt = ''; }
            var editor;
            regex = regex.source || regex;
            editor = {
                replace: function (name, val) {
                    val = val.source || val;
                    val = val.replace(/(^|[^\[])\^/g, '$1');
                    regex = regex.replace(name, val);
                    return editor;
                },
                getRegex: function () {
                    return new RegExp(regex, opt);
                }
            };
            return editor;
        }
        helpers.edit = edit;
        function cleanUrl(sanitize, base, href) {
            if (sanitize) {
                try {
                    var prot = decodeURIComponent(unescape(href))
                        .replace(/[^\w:]/g, '')
                        .toLowerCase();
                }
                catch (e) {
                    return null;
                }
                if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
                    return null;
                }
            }
            if (base && !originIndependentUrl.test(href)) {
                href = resolveUrl(base, href);
            }
            try {
                href = encodeURI(href).replace(/%25/g, '%');
            }
            catch (e) {
                return null;
            }
            return href;
        }
        helpers.cleanUrl = cleanUrl;
        var baseUrls = {};
        function resolveUrl(base, href) {
            if (!baseUrls[' ' + base]) {
                // we can ignore everything in base after the last slash of its path component,
                // but we might need to add _that_
                // https://tools.ietf.org/html/rfc3986#section-3
                if (/^[^:]+:\/*[^/]*$/.test(base)) {
                    baseUrls[' ' + base] = base + '/';
                }
                else {
                    baseUrls[' ' + base] = rtrim(base, '/', true);
                }
            }
            base = baseUrls[' ' + base];
            if (href.slice(0, 2) === '//') {
                return base.replace(/:[\s\S]*/, ':') + href;
            }
            else if (href.charAt(0) === '/') {
                return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
            }
            else {
                return base + href;
            }
        }
        helpers.resolveUrl = resolveUrl;
        var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
        function merge(obj) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var target;
            var key;
            for (var i = 0; i < args.length; i++) {
                target = args[i];
                for (key in target) {
                    if (Object.prototype.hasOwnProperty.call(target, key)) {
                        obj[key] = target[key];
                    }
                }
            }
            return obj;
        }
        helpers.merge = merge;
        function splitCells(tableRow, count) {
            // ensure that every cell-delimiting pipe has a space
            // before it to distinguish it from an escaped pipe
            var row = tableRow.replace(/\|/g, function (match, offset, str) {
                var escaped = false, curr = offset;
                while (--curr >= 0 && str[curr] === '\\') {
                    escaped = !escaped;
                }
                ;
                if (escaped) {
                    // odd number of slashes means | is escaped
                    // so we leave it alone
                    return '|';
                }
                else {
                    // add space before unescaped |
                    return ' |';
                }
            });
            var cells = row.split(/ \|/);
            if (cells.length > count) {
                cells.splice(count);
            }
            else {
                while (cells.length < count)
                    cells.push('');
            }
            for (var i = 0; i < cells.length; i++) {
                // leading or trailing whitespace is ignored per the gfm spec
                cells[i] = cells[i].trim().replace(/\\\|/g, '|');
            }
            return cells;
        }
        helpers.splitCells = splitCells;
        /**
         * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
         * ``/c*$/`` is vulnerable to REDOS.
         *
         * @param invert Remove suffix of non-c chars instead. Default falsey.
        */
        function rtrim(str, c, invert) {
            if (invert === void 0) { invert = false; }
            if (str.length === 0) {
                return '';
            }
            // Length of suffix matching the invert condition.
            var suffLen = 0;
            // Step left until we fail to match the invert condition.
            while (suffLen < str.length) {
                var currChar = str.charAt(str.length - suffLen - 1);
                if (currChar === c && !invert) {
                    suffLen++;
                }
                else if (currChar !== c && invert) {
                    suffLen++;
                }
                else {
                    break;
                }
            }
            return str.substr(0, str.length - suffLen);
        }
        helpers.rtrim = rtrim;
    })(helpers = markedjs.helpers || (markedjs.helpers = {}));
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    var Grammer = /** @class */ (function () {
        function Grammer() {
        }
        return Grammer;
    }());
    markedjs.Grammer = Grammer;
})(markedjs || (markedjs = {}));
/// <reference path="../models/abstract.ts" />
var markedjs;
(function (markedjs) {
    /**
     * Block-Level Grammar
    */
    var block = /** @class */ (function (_super) {
        __extends(block, _super);
        function block() {
            var _this = _super.call(this) || this;
            _this._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
            _this._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
            _this._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
                + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
                + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
                + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
                + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
                + '|track|ul';
            // base class initialize
            _this.newline = /^\n+/;
            _this.code = /^( {4}[^\n]+\n*)+/;
            _this.fences = markedjs.helpers.noop;
            _this.hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/;
            _this.heading = /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/;
            _this.nptable = markedjs.helpers.noop;
            _this.blockquote = /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/;
            _this.list = /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/;
            _this.html = new RegExp(block.blockHtml());
            _this.def = /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/;
            _this.table = markedjs.helpers.noop;
            _this.lheading = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
            _this.paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/;
            _this.text = /^[^\n]+/;
            // edit and modify from base
            _this.def = markedjs.helpers.edit(_this.def)
                .replace('label', _this._label)
                .replace('title', _this._title)
                .getRegex();
            _this.list = markedjs.helpers.edit(_this.list)
                .replace(/bull/g, block.bullet)
                .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
                .replace('def', '\\n+(?=' + _this.def.source + ')')
                .getRegex();
            _this.item = markedjs.helpers.edit(/^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/, 'gm')
                .replace(/bull/g, block.bullet)
                .getRegex();
            _this.html = markedjs.helpers.edit(_this.html, 'i')
                .replace('comment', block._comment)
                .replace('tag', _this._tag)
                .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
                .getRegex();
            _this.paragraph = markedjs.helpers.edit(_this.paragraph)
                .replace('hr', _this.hr)
                .replace('heading', _this.heading)
                .replace('lheading', _this.lheading)
                .replace('tag', _this._tag) // pars can be interrupted by type (6) html blocks
                .getRegex();
            _this.blockquote = markedjs.helpers.edit(_this.blockquote)
                .replace('paragraph', _this.paragraph)
                .getRegex();
            var vm = _this;
            _this.normal = markedjs.helpers.merge({}, vm);
            _this.gfm = (function () {
                var rule = markedjs.helpers.merge({}, vm.normal, {
                    fences: /^ {0,3}(`{3,}|~{3,})([^`\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
                    paragraph: /^/,
                    heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
                });
                rule.paragraph = markedjs.helpers.edit(vm.paragraph)
                    .replace('(?!', '(?!'
                    + rule.fences.source.replace('\\1', '\\2') + '|'
                    + vm.list.source.replace('\\1', '\\3') + '|')
                    .getRegex();
                return rule;
            })();
            _this.tables = markedjs.helpers.merge({}, _this.gfm, {
                nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
                table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
            });
            _this.pedantic = markedjs.helpers.merge({}, _this.normal, {
                html: markedjs.helpers.edit('^ *(?:comment *(?:\\n|\\s*$)'
                    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
                    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
                    .replace('comment', block._comment)
                    .replace(/tag/g, '(?!(?:'
                    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
                    + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
                    + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
                    .getRegex(),
                def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
            });
            return _this;
        }
        block.blockHtml = function () {
            return '^ {0,3}(?:' // optional indentation
                + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
                + '|comment[^\\n]*(\\n+|$)' // (2)
                + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
                + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
                + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
                + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
                + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
                + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
                + ')';
        };
        block._comment = /<!--(?!-?>)[\s\S]*?-->/;
        block.bullet = /(?:[*+-]|\d{1,9}\.)/;
        return block;
    }(markedjs.Grammer));
    markedjs.block = block;
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    /**
     * Inline-Level Grammar
    */
    var inline = /** @class */ (function (_super) {
        __extends(inline, _super);
        function inline() {
            var _this = _super.call(this) || this;
            // list of punctuation marks from common mark spec
            // without ` and ] to workaround Rule 17 (inline code blocks/links)
            _this._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
            _this._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
            _this._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
            _this._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
            _this._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
            _this._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
            _this._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
            _this._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
            // base class initialize
            _this.escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
            _this.autolink = /^<(scheme:[^\s\x00-\x1f<>]*|email)>/;
            _this.url = markedjs.helpers.noop;
            _this.tag = new RegExp(inline.inlineTag());
            _this.link = /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/;
            _this.reflink = /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/;
            _this.nolink = /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/;
            _this.strong = /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/;
            _this.em = /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/;
            _this.code = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
            _this.br = /^( {2,}|\\)\n(?!\s*$)/;
            _this.del = markedjs.helpers.noop;
            _this.text = /^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/;
            // edits and modify
            _this.em = markedjs.helpers.edit(_this.em).replace(/punctuation/g, _this._punctuation).getRegex();
            _this.autolink = markedjs.helpers.edit(_this.autolink)
                .replace('scheme', _this._scheme)
                .replace('email', _this._email)
                .getRegex();
            _this.tag = markedjs.helpers.edit(_this.tag)
                .replace('comment', markedjs.block._comment)
                .replace('attribute', _this._attribute)
                .getRegex();
            _this.link = markedjs.helpers.edit(_this.link)
                .replace('label', _this._label)
                .replace('href', _this._href)
                .replace('title', _this._title)
                .getRegex();
            _this.reflink = markedjs.helpers.edit(_this.reflink)
                .replace('label', _this._label)
                .getRegex();
            var vm = _this;
            _this.normal = markedjs.helpers.merge({}, _this);
            _this.pedantic = markedjs.helpers.merge({}, _this.normal, {
                strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
                em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
                link: markedjs.helpers.edit(/^!?\[(label)\]\((.*?)\)/)
                    .replace('label', vm._label)
                    .getRegex(),
                reflink: markedjs.helpers.edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
                    .replace('label', vm._label)
                    .getRegex()
            });
            _this.gfm = markedjs.helpers.merge({}, _this.normal, {
                escape: markedjs.helpers.edit(vm.escape).replace('])', '~|])').getRegex(),
                _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
                url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
                _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
                del: /^~+(?=\S)([\s\S]*?\S)~+/,
                text: markedjs.helpers.edit(vm.text)
                    .replace(']|', '~]|')
                    .replace('|$', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|$')
                    .getRegex()
            });
            _this.gfm.url = markedjs.helpers.edit(_this.gfm.url, 'i')
                .replace('email', _this.gfm._extended_email)
                .getRegex();
            _this.breaks = markedjs.helpers.merge({}, _this.gfm, {
                br: markedjs.helpers.edit(vm.br).replace('{2,}', '*').getRegex(),
                text: markedjs.helpers.edit(vm.gfm.text).replace('{2,}', '*').getRegex()
            });
            return _this;
        }
        inline.inlineTag = function () {
            return '^comment'
                + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
                + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
                + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
                + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
                + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'; // CDATA section
        };
        return inline;
    }(markedjs.Grammer));
    markedjs.inline = inline;
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    var component = /** @class */ (function () {
        function component(opt) {
            this.options = opt;
        }
        return component;
    }());
    markedjs.component = component;
})(markedjs || (markedjs = {}));
/// <reference path="../models/component.ts" />
var markedjs;
(function (markedjs) {
    /**
     * Inline Lexer & Compiler
    */
    var inlineLexer = /** @class */ (function (_super) {
        __extends(inlineLexer, _super);
        function inlineLexer(links, options) {
            if (options === void 0) { options = null; }
            var _this = _super.call(this, options) || this;
            var inline = options.inline;
            _this.links = links;
            _this.rules = options.inline.normal;
            _this.renderer = _this.options.renderer || new markedjs.htmlRenderer();
            _this.renderer.options = _this.options;
            if (!_this.links) {
                throw new Error('Tokens array requires a `links` property.');
            }
            if (_this.options.pedantic) {
                _this.rules = inline.pedantic;
            }
            else if (_this.options.gfm) {
                if (_this.options.breaks) {
                    _this.rules = inline.breaks;
                }
                else {
                    _this.rules = inline.gfm;
                }
            }
            return _this;
        }
        /**
         * Static Lexing/Compiling Method
        */
        inlineLexer.Output = function (src, links, options) {
            return new inlineLexer(links, options).output(src);
        };
        ;
        /**
         * Lexing/Compiling
         */
        inlineLexer.prototype.output = function (src) {
            var out = '', link, text, href, title, cap, prevCapZero;
            while (src) {
                // escape
                if (cap = this.rules.escape.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += escape(cap[1]);
                    continue;
                }
                // tag
                if (cap = this.rules.tag.exec(src)) {
                    if (!this.inLink && /^<a /i.test(cap[0])) {
                        this.inLink = true;
                    }
                    else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                        this.inLink = false;
                    }
                    if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = true;
                    }
                    else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = false;
                    }
                    src = src.substring(cap[0].length);
                    out += this.options.sanitize
                        ? this.options.sanitizer
                            ? this.options.sanitizer(cap[0])
                            : escape(cap[0])
                        : cap[0];
                    continue;
                }
                // link
                if (cap = this.rules.link.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.inLink = true;
                    href = cap[2];
                    if (this.options.pedantic) {
                        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
                        if (link) {
                            href = link[1];
                            title = link[3];
                        }
                        else {
                            title = '';
                        }
                    }
                    else {
                        title = cap[3] ? cap[3].slice(1, -1) : '';
                    }
                    href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
                    out += this.outputLink(cap, {
                        href: this.escapes(href),
                        title: this.escapes(title)
                    });
                    this.inLink = false;
                    continue;
                }
                // reflink, nolink
                if ((cap = this.rules.reflink.exec(src))
                    || (cap = this.rules.nolink.exec(src))) {
                    src = src.substring(cap[0].length);
                    link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                    link = this.links[link.toLowerCase()];
                    if (!link || !link.href) {
                        out += cap[0].charAt(0);
                        src = cap[0].substring(1) + src;
                        continue;
                    }
                    this.inLink = true;
                    out += this.outputLink(cap, link);
                    this.inLink = false;
                    continue;
                }
                // strong
                if (cap = this.rules.strong.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }
                // em
                if (cap = this.rules.em.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }
                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.codespan(markedjs.helpers.escape.doescape(cap[2].trim(), true));
                    continue;
                }
                // br
                if (cap = this.rules.br.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.br();
                    continue;
                }
                // del (gfm)
                if (cap = this.rules.del.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.del(this.output(cap[1]));
                    continue;
                }
                // autolink
                if (cap = this.rules.autolink.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[2] === '@') {
                        text = escape(this.mangle(cap[1]));
                        href = 'mailto:' + text;
                    }
                    else {
                        text = escape(cap[1]);
                        href = text;
                    }
                    out += this.renderer.link(href, null, text);
                    continue;
                }
                // url (gfm)
                if (!this.inLink && (cap = this.rules.url.exec(src))) {
                    if (cap[2] === '@') {
                        text = escape(cap[0]);
                        href = 'mailto:' + text;
                    }
                    else {
                        // do extended autolink path validation
                        do {
                            prevCapZero = cap[0];
                            cap[0] = this.rules._backpedal.exec(cap[0])[0];
                        } while (prevCapZero !== cap[0]);
                        text = escape(cap[0]);
                        if (cap[1] === 'www.') {
                            href = 'http://' + text;
                        }
                        else {
                            href = text;
                        }
                    }
                    src = src.substring(cap[0].length);
                    out += this.renderer.link(href, null, text);
                    continue;
                }
                // text
                if (cap = this.rules.text.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (this.inRawBlock) {
                        out += this.renderer.text(cap[0]);
                    }
                    else {
                        out += this.renderer.text(escape(this.smartypants(cap[0])));
                    }
                    continue;
                }
                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }
            return unescape(out);
        };
        ;
        inlineLexer.prototype.escapes = function (text) {
            return text ? text.replace(this.rules._escapes, '$1') : text;
        };
        ;
        /**
         * Compile Link
         */
        inlineLexer.prototype.outputLink = function (cap, link) {
            var href = link.href, title = link.title ? escape(link.title) : null;
            return cap[0].charAt(0) !== '!'
                ? this.renderer.link(href, title, this.output(cap[1]))
                : this.renderer.image(href, title, escape(cap[1]));
        };
        ;
        /**
         * Smartypants Transformations
         */
        inlineLexer.prototype.smartypants = function (text) {
            if (!this.options.smartypants)
                return text;
            return text
                // em-dashes
                .replace(/---/g, '\u2014')
                // en-dashes
                .replace(/--/g, '\u2013')
                // opening singles
                .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
                // closing singles & apostrophes
                .replace(/'/g, '\u2019')
                // opening doubles
                .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
                // closing doubles
                .replace(/"/g, '\u201d')
                // ellipses
                .replace(/\.{3}/g, '\u2026');
        };
        ;
        /**
         * Mangle Links
         */
        inlineLexer.prototype.mangle = function (text) {
            if (!this.options.mangle)
                return text;
            var out = '', l = text.length, i = 0, ch;
            for (; i < l; i++) {
                ch = text.charCodeAt(i);
                if (Math.random() > 0.5) {
                    ch = 'x' + ch.toString(16);
                }
                out += '&#' + ch + ';';
            }
            return out;
        };
        ;
        return inlineLexer;
    }(markedjs.component));
    markedjs.inlineLexer = inlineLexer;
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    /**
     * Block Lexer
    */
    var Lexer = /** @class */ (function () {
        function Lexer(options) {
            this.options = options;
            var block = options.block;
            this.tokens = [];
            this.tokens.links = Object.create(null);
            this.rules = options.block.normal;
            if (this.options.pedantic) {
                this.rules = block.pedantic;
            }
            else if (this.options.gfm) {
                if (this.options.tables) {
                    this.rules = block.tables;
                }
                else {
                    this.rules = block.gfm;
                }
            }
        }
        /**
         * Preprocessing
        */
        Lexer.prototype.lex = function (src) {
            src = src
                .replace(/\r\n|\r/g, '\n')
                .replace(/\t/g, '    ')
                .replace(/\u00a0/g, ' ')
                .replace(/\u2424/g, '\n');
            return this.token(src, true);
        };
        ;
        /**
         * Lexing
        */
        Lexer.prototype.token = function (src, top) {
            src = src.replace(/^ +$/gm, '');
            var next, loose, cap, bull, b, item, listStart, listItems, t, space, i, tag, l, isordered, istask, ischecked;
            while (src) {
                // newline
                if (cap = this.rules.newline.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[0].length > 1) {
                        this.tokens.push({
                            type: 'space'
                        });
                    }
                }
                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    cap = cap[0].replace(/^ {4}/gm, '');
                    this.tokens.push({
                        type: 'code',
                        text: !this.options.pedantic
                            ? markedjs.helpers.rtrim(cap, '\n')
                            : cap
                    });
                    continue;
                }
                // fences (gfm)
                if (cap = this.rules.fences.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'code',
                        lang: cap[2] ? cap[2].trim() : cap[2],
                        text: cap[3] || ''
                    });
                    continue;
                }
                // heading
                if (cap = this.rules.heading.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'heading',
                        depth: cap[1].length,
                        text: cap[2]
                    });
                    continue;
                }
                // table no leading pipe (gfm)
                if (top && (cap = this.rules.nptable.exec(src))) {
                    item = {
                        type: 'table',
                        header: markedjs.helpers.splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                    };
                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);
                        for (i = 0; i < item.align.length; i++) {
                            if (/^ *-+: *$/.test(item.align[i])) {
                                item.align[i] = 'right';
                            }
                            else if (/^ *:-+: *$/.test(item.align[i])) {
                                item.align[i] = 'center';
                            }
                            else if (/^ *:-+ *$/.test(item.align[i])) {
                                item.align[i] = 'left';
                            }
                            else {
                                item.align[i] = null;
                            }
                        }
                        for (i = 0; i < item.cells.length; i++) {
                            item.cells[i] = markedjs.helpers.splitCells(item.cells[i], item.header.length);
                        }
                        this.tokens.push(item);
                        continue;
                    }
                }
                // hr
                if (cap = this.rules.hr.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'hr'
                    });
                    continue;
                }
                // blockquote
                if (cap = this.rules.blockquote.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'blockquote_start'
                    });
                    cap = cap[0].replace(/^ *> ?/gm, '');
                    // Pass `top` to keep the current
                    // "toplevel" state. This is exactly
                    // how markdown.pl works.
                    this.token(cap, top);
                    this.tokens.push({
                        type: 'blockquote_end'
                    });
                    continue;
                }
                // list
                if (cap = this.rules.list.exec(src)) {
                    src = src.substring(cap[0].length);
                    bull = cap[2];
                    isordered = bull.length > 1;
                    listStart = {
                        type: 'list_start',
                        ordered: isordered,
                        start: isordered ? +bull : '',
                        loose: false
                    };
                    this.tokens.push(listStart);
                    // Get each top-level item.
                    cap = cap[0].match(this.rules.item);
                    listItems = [];
                    next = false;
                    l = cap.length;
                    i = 0;
                    for (; i < l; i++) {
                        item = cap[i];
                        // Remove the list item's bullet
                        // so it is seen as the next token.
                        space = item.length;
                        item = item.replace(/^ *([*+-]|\d+\.) */, '');
                        // Outdent whatever the
                        // list item contains. Hacky.
                        if (~item.indexOf('\n ')) {
                            space -= item.length;
                            item = !this.options.pedantic
                                ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                                : item.replace(/^ {1,4}/gm, '');
                        }
                        // Determine whether the next list item belongs here.
                        // Backpedal if it does not belong in this list.
                        if (i !== l - 1) {
                            b = markedjs.block.bullet.exec(cap[i + 1])[0];
                            if (bull.length > 1 ? b.length === 1
                                : (b.length > 1 || (this.options.smartLists && b !== bull))) {
                                src = cap.slice(i + 1).join('\n') + src;
                                i = l - 1;
                            }
                        }
                        // Determine whether item is loose or not.
                        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                        // for discount behavior.
                        loose = next || /\n\n(?!\s*$)/.test(item);
                        if (i !== l - 1) {
                            next = item.charAt(item.length - 1) === '\n';
                            if (!loose)
                                loose = next;
                        }
                        if (loose) {
                            listStart.loose = true;
                        }
                        // Check for task list items
                        istask = /^\[[ xX]\] /.test(item);
                        ischecked = undefined;
                        if (istask) {
                            ischecked = item[1] !== ' ';
                            item = item.replace(/^\[[ xX]\] +/, '');
                        }
                        t = {
                            type: 'list_item_start',
                            task: istask,
                            checked: ischecked,
                            loose: loose
                        };
                        listItems.push(t);
                        this.tokens.push(t);
                        // Recurse.
                        this.token(item, false);
                        this.tokens.push({
                            type: 'list_item_end'
                        });
                    }
                    if (listStart.loose) {
                        l = listItems.length;
                        i = 0;
                        for (; i < l; i++) {
                            listItems[i].loose = true;
                        }
                    }
                    this.tokens.push({
                        type: 'list_end'
                    });
                    continue;
                }
                // html
                if (cap = this.rules.html.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: this.options.sanitize
                            ? 'paragraph'
                            : 'html',
                        pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                        text: cap[0]
                    });
                    continue;
                }
                // def
                if (top && (cap = this.rules.def.exec(src))) {
                    src = src.substring(cap[0].length);
                    if (cap[3])
                        cap[3] = cap[3].substring(1, cap[3].length - 1);
                    tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
                    if (!this.tokens.links[tag]) {
                        this.tokens.links[tag] = {
                            href: cap[2],
                            title: cap[3]
                        };
                    }
                    continue;
                }
                // table (gfm)
                if (top && (cap = this.rules.table.exec(src))) {
                    item = {
                        type: 'table',
                        header: markedjs.helpers.splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, '').split('\n') : []
                    };
                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);
                        for (i = 0; i < item.align.length; i++) {
                            if (/^ *-+: *$/.test(item.align[i])) {
                                item.align[i] = 'right';
                            }
                            else if (/^ *:-+: *$/.test(item.align[i])) {
                                item.align[i] = 'center';
                            }
                            else if (/^ *:-+ *$/.test(item.align[i])) {
                                item.align[i] = 'left';
                            }
                            else {
                                item.align[i] = null;
                            }
                        }
                        for (i = 0; i < item.cells.length; i++) {
                            item.cells[i] = markedjs.helpers.splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
                        }
                        this.tokens.push(item);
                        continue;
                    }
                }
                // lheading
                if (cap = this.rules.lheading.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'heading',
                        depth: cap[2] === '=' ? 1 : 2,
                        text: cap[1]
                    });
                    continue;
                }
                // top-level paragraph
                if (top && (cap = this.rules.paragraph.exec(src))) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'paragraph',
                        text: cap[1].charAt(cap[1].length - 1) === '\n'
                            ? cap[1].slice(0, -1)
                            : cap[1]
                    });
                    continue;
                }
                // text
                if (cap = this.rules.text.exec(src)) {
                    // Top-level should never reach here.
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'text',
                        text: cap[0]
                    });
                    continue;
                }
                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }
            return this.tokens;
        };
        return Lexer;
    }());
    markedjs.Lexer = Lexer;
})(markedjs || (markedjs = {}));
/// <reference path="../models/component.ts" />
/// <reference path="./inlineLexer.ts" />
var markedjs;
(function (markedjs) {
    /**
     * Parsing & Compiling
    */
    var parser = /** @class */ (function (_super) {
        __extends(parser, _super);
        function parser(options) {
            if (options === void 0) { options = null; }
            var _this = _super.call(this, options) || this;
            _this.tokens = [];
            _this.token = null;
            _this.options.renderer = _this.options.renderer || new markedjs.htmlRenderer();
            _this.renderer = _this.options.renderer;
            _this.renderer.options = _this.options;
            return _this;
        }
        /**
         * Parse Loop
        */
        parser.prototype.parse = function (src) {
            var out = "";
            var links = src.links;
            var textOpt = markedjs.helpers.merge({}, this.options, {
                renderer: new markedjs.textRenderer()
            });
            this.inline = new markedjs.inlineLexer(links, this.options);
            // use an InlineLexer with a TextRenderer to extract pure text
            this.inlineText = new markedjs.inlineLexer(links, textOpt);
            this.tokens = src.reverse();
            while (this.next()) {
                out += this.tok();
            }
            return out;
        };
        ;
        /**
         * Next Token
        */
        parser.prototype.next = function () {
            return this.token = this.tokens.pop();
        };
        ;
        /**
         * Preview Next Token
        */
        parser.prototype.peek = function () {
            return this.tokens[this.tokens.length - 1] || 0;
        };
        ;
        /**
         * Parse Text Tokens
        */
        parser.prototype.parseText = function () {
            var body = this.token.text;
            while (this.peek().type === 'text') {
                body += '\n' + this.next().text;
            }
            return this.inline.output(body);
        };
        ;
        /**
         * Parse Current Token
        */
        parser.prototype.tok = function () {
            switch (this.token.type) {
                case 'space': {
                    return '';
                }
                case 'hr': {
                    return this.renderer.hr();
                }
                case 'heading': {
                    var raw = this.inlineText.output(this.token.text);
                    return this.renderer.heading(raw, this.token.depth, raw);
                }
                case 'code': {
                    return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
                }
                case 'table': {
                    var header = '', body = '', i, row, cell = '', j;
                    // header         
                    for (i = 0; i < this.token.header.length; i++) {
                        cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
                    }
                    header += this.renderer.tablerow(cell);
                    for (i = 0; i < this.token.cells.length; i++) {
                        row = this.token.cells[i];
                        cell = '';
                        for (j = 0; j < row.length; j++) {
                            cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
                        }
                        body += this.renderer.tablerow(cell);
                    }
                    return this.renderer.table(header, body);
                }
                case 'blockquote_start': {
                    body = '';
                    while (this.next().type !== 'blockquote_end') {
                        body += this.tok();
                    }
                    return this.renderer.blockquote(body);
                }
                case 'list_start': {
                    body = '';
                    var ordered = this.token.ordered, start = this.token.start;
                    while (this.next().type !== 'list_end') {
                        body += this.tok();
                    }
                    return this.renderer.list(body, ordered, start);
                }
                case 'list_item_start': {
                    body = '';
                    var loose = this.token.loose;
                    if (this.token.task) {
                        body += this.renderer.checkbox(this.token.checked);
                    }
                    while (this.next().type !== 'list_item_end') {
                        body += !loose && this.token.type === 'text'
                            ? this.parseText()
                            : this.tok();
                    }
                    return this.renderer.listitem(body);
                }
                case 'html': {
                    // TODO parse inline content if parameter markdown=1
                    return this.renderer.html(this.token.text);
                }
                case 'paragraph': {
                    return this.renderer.paragraph(this.inline.output(this.token.text));
                }
                case 'text': {
                    return this.renderer.paragraph(this.parseText());
                }
                default: {
                    var errMsg = 'Token with "' + this.token.type + '" type was not found.';
                    if (this.options.silent) {
                        console.log(errMsg);
                    }
                    else {
                        throw new Error(errMsg);
                    }
                }
            }
        };
        return parser;
    }(markedjs.component));
    markedjs.parser = parser;
})(markedjs || (markedjs = {}));
/// <reference path="./option.ts" />
/// <reference path="./helpers/escape.ts" />
/// <reference path="./helpers/helpers.ts" />
/// <reference path="./parser/block.ts" />
/// <reference path="./parser/inline.ts" />
/// <reference path="./parser/inlineLexer.ts" />
/// <reference path="./parser/lexer.ts" />
/// <reference path="./parser/parser.ts" />
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
*/
var marked = (function () {
    var markedCallback = function (src, opt, callback) {
        var highlight = opt.highlight, tokens, pending, i = 0;
        try {
            tokens = new markedjs.Lexer(opt).lex(src);
        }
        catch (e) {
            return callback(e);
        }
        pending = tokens.length;
        var done = function (err) {
            if (err === void 0) { err = null; }
            if (err) {
                opt.highlight = highlight;
                return callback(err);
            }
            var out;
            try {
                out = new markedjs.parser(opt).parse(tokens);
            }
            catch (e) {
                err = e;
            }
            opt.highlight = highlight;
            return err
                ? callback(err)
                : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
            return done();
        }
        delete opt.highlight;
        if (!pending)
            return done();
        for (; i < tokens.length; i++) {
            (function (token) {
                if (token.type !== 'code') {
                    return --pending || done();
                }
                return highlight(token.text, token.lang, function (err, code) {
                    if (err)
                        return done(err);
                    if (code == null || code === token.text) {
                        return --pending || done();
                    }
                    token.text = code;
                    token.escaped = true;
                    --pending || done();
                });
            })(tokens[i]);
        }
    };
    var marked = function marked(src, opt, callback) {
        if (opt === void 0) { opt = markedjs.option.Defaults; }
        if (callback === void 0) { callback = null; }
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
            throw new Error('marked(): input parameter is undefined or null');
        }
        if (typeof src !== 'string') {
            throw new Error('marked(): input parameter is of type '
                + Object.prototype.toString.call(src) + ', string expected');
        }
        if (callback || typeof opt === 'function') {
            if (!callback) {
                callback = opt;
                opt = null;
            }
            opt = markedjs.helpers.merge({}, markedjs.option.Defaults, opt || {});
            markedCallback(src, opt, callback);
        }
        else {
            try {
                if (opt)
                    opt = markedjs.helpers.merge({}, markedjs.option.Defaults, opt);
                var lexer = new markedjs.Lexer(opt);
                var tokens = lexer.lex(src);
                var mdparser = new markedjs.parser(opt);
                var output = mdparser.parse(tokens);
                if (opt.debug) {
                    console.log(output);
                }
                return output;
            }
            catch (e) {
                e.message += '\nPlease report this to https://github.com/markedjs/marked.';
                if ((opt || markedjs.option.Defaults).silent) {
                    return '<p>An error occurred:</p><pre>'
                        + markedjs.helpers.escape.doescape(e.message + '', true)
                        + '</pre>';
                }
                throw e;
            }
        }
    };
    return marked;
})();
var markedjs;
(function (markedjs) {
    var helpers;
    (function (helpers) {
        /**
         * No operation: this regexp object do nothing.
        */
        helpers.noop = (function () {
            var empty = function noop() {
                // do nothing
            };
            empty.exec = empty;
            // This regexp do nothing
            return empty;
        })();
    })(helpers = markedjs.helpers || (markedjs.helpers = {}));
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    var htmlRenderer = /** @class */ (function (_super) {
        __extends(htmlRenderer, _super);
        function htmlRenderer() {
            return _super.call(this, null) || this;
        }
        htmlRenderer.prototype.html = function (text) {
            return text;
        };
        htmlRenderer.prototype.text = function (text) {
            // return `<pre>${text}</pre>`;
            return text;
        };
        htmlRenderer.prototype.code = function (code, infostring, escaped) {
            var lang = (infostring || '').match(/\S*/)[0];
            if (this.options.highlight) {
                var out = this.options.highlight(code, lang);
                if (out != null && out !== code) {
                    escaped = true;
                    code = out;
                }
            }
            if (!lang) {
                return '<pre><code>'
                    + (escaped ? code : markedjs.helpers.escape.doescape(code, true))
                    + '</code></pre>';
            }
            return '<pre><code class="'
                + this.options.langPrefix
                + markedjs.helpers.escape.doescape(lang, true)
                + '">'
                + (escaped ? code : markedjs.helpers.escape.doescape(code, true))
                + '</code></pre>\n';
        };
        ;
        htmlRenderer.prototype.blockquote = function (quote) {
            return '<blockquote>\n' + quote + '</blockquote>\n';
        };
        ;
        htmlRenderer.prototype.heading = function (text, level, raw) {
            if (this.options.headerIds) {
                return '<h'
                    + level
                    + ' id="'
                    + this.options.headerPrefix
                    + raw.toLowerCase().replace(/[^\w]+/g, '-')
                    + '">'
                    + text
                    + '</h'
                    + level
                    + '>\n';
            }
            // ignore IDs
            return '<h' + level + '>' + text + '</h' + level + '>\n';
        };
        ;
        htmlRenderer.prototype.hr = function () {
            return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };
        ;
        htmlRenderer.prototype.list = function (body, ordered, start) {
            var type = ordered ? 'ol' : 'ul', startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
            return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };
        ;
        htmlRenderer.prototype.listitem = function (text) {
            return '<li>' + text + '</li>\n';
        };
        ;
        htmlRenderer.prototype.checkbox = function (checked) {
            return '<input '
                + (checked ? 'checked="" ' : '')
                + 'disabled="" type="checkbox"'
                + (this.options.xhtml ? ' /' : '')
                + '> ';
        };
        ;
        htmlRenderer.prototype.paragraph = function (text) {
            return '<p>' + text + '</p>\n';
        };
        ;
        htmlRenderer.prototype.table = function (header, body) {
            if (body)
                body = '<tbody>' + body + '</tbody>';
            return '<table>\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + body
                + '</table>\n';
        };
        ;
        htmlRenderer.prototype.tablerow = function (content) {
            return '<tr>\n' + content + '</tr>\n';
        };
        ;
        htmlRenderer.prototype.tablecell = function (content, flags) {
            var type = flags.header ? 'th' : 'td';
            var tag = flags.align
                ? '<' + type + ' align="' + flags.align + '">'
                : '<' + type + '>';
            return tag + content + '</' + type + '>\n';
        };
        ;
        // span level renderer
        htmlRenderer.prototype.strong = function (text) {
            return '<strong>' + text + '</strong>';
        };
        ;
        htmlRenderer.prototype.em = function (text) {
            return '<em>' + text + '</em>';
        };
        ;
        htmlRenderer.prototype.codespan = function (text) {
            return '<code>' + text + '</code>';
        };
        ;
        htmlRenderer.prototype.br = function () {
            return this.options.xhtml ? '<br/>' : '<br>';
        };
        ;
        htmlRenderer.prototype.del = function (text) {
            return '<del>' + text + '</del>';
        };
        ;
        htmlRenderer.prototype.link = function (href, title, text) {
            href = markedjs.helpers.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            var out = '<a href="' + escape(href) + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>' + text + '</a>';
            return out;
        };
        ;
        htmlRenderer.prototype.image = function (href, title, text) {
            href = markedjs.helpers.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            else if (htmlRenderer.hrefSolver && htmlRenderer.hrefSolver != undefined) {
                href = htmlRenderer.hrefSolver(href);
            }
            var out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            return out;
        };
        ;
        return htmlRenderer;
    }(markedjs.component));
    markedjs.htmlRenderer = htmlRenderer;
})(markedjs || (markedjs = {}));
var markedjs;
(function (markedjs) {
    /**
     * returns only the textual part of the token
     * no need for block level renderers
    */
    var textRenderer = /** @class */ (function () {
        function textRenderer() {
        }
        textRenderer.prototype.code = function (text, lang, escaped) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.hr = function () {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.html = function (text) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.heading = function (text, depth, unescape) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.tablerow = function (cell) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.tablecell = function (text, opt) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.table = function (thead, tbody) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.blockquote = function (text) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.list = function (body, ordered, start) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.checkbox = function (checked) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.listitem = function (text) {
            throw new Error("Method not implemented.");
        };
        textRenderer.prototype.paragraph = function (text) {
            return text + "\n";
        };
        textRenderer.prototype.strong = function (text) {
            return text;
        };
        textRenderer.prototype.em = function (text) {
            return text;
        };
        textRenderer.prototype.codespan = function (text) {
            return text;
        };
        textRenderer.prototype.del = function (text) {
            return text;
        };
        textRenderer.prototype.text = function (text) {
            return text;
        };
        textRenderer.prototype.image = function (href, title, text) {
            return '' + text;
        };
        ;
        textRenderer.prototype.link = function (href, title, text) {
            return '' + text;
        };
        ;
        textRenderer.prototype.br = function () {
            return '';
        };
        ;
        return textRenderer;
    }());
    markedjs.textRenderer = textRenderer;
})(markedjs || (markedjs = {}));
//# sourceMappingURL=marked.js.map