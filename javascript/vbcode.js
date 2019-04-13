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
var vscode;
(function (vscode) {
    function defaultStyle() {
        return {
            string: "#a31515",
            comment: "#008000",
            keyword: "#0000ff",
            attribute: "#2b91af",
            type: "#2b91af",
            directive: "grey",
            globalFont: {
                fontName: "Consolas",
                size: { pixel: 11 }
            }
        };
    }
    vscode.defaultStyle = defaultStyle;
    function applyStyle(div, style) {
        if (style === void 0) { style = vscode.VisualStudio; }
        var preview = typeof div == "string" ? $ts(div) : div;
        $ts.select(".string").attr("style", "color: " + style.string + ";");
        $ts.select(".comment").attr("style", "color: " + style.comment + ";");
        $ts.select(".keyword").attr("style", "color: " + style.keyword);
        $ts.select(".attribute").attr("style", "color: " + style.attribute);
        $ts.select(".type").attr("style", "color: " + style.type);
        $ts.select(".directive").attr("style", "color: " + style.directive);
        $ts.select(".line-hash").attr("style", "color: #3c3e3e; text-decoration: none;");
        CanvasHelper.CSSFont.applyCSS(preview, style.globalFont);
        // set additional styles.
        preview.style.lineHeight = "1.125em;";
    }
    vscode.applyStyle = applyStyle;
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    /**
     * 输出的是一个``table``对象的html文本
    */
    var tokenStyler = /** @class */ (function () {
        //#endregion
        function tokenStyler(hashHandler, parseTOC) {
            this.hashHandler = hashHandler;
            this.parseTOC = parseTOC;
            this.code = new StringBuilder("", "<br />\n");
            this.rowList = [];
            /**
             * 上一个追加的单词是一个类型定义或者引用的关键词
            */
            this.lastTypeKeyword = false;
            this.lastNewLine = true;
            this.lastDirective = false;
            this.lastToken = null;
            this.summary = new vscode.TOC.Summary();
        }
        Object.defineProperty(tokenStyler.prototype, "rows", {
            //#region "status"
            get: function () {
                return this.rowList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "lineNumber", {
            /**
             * 获取当前的符号所处的行号
            */
            get: function () {
                return this.rowList.length + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "LastAddedToken", {
            /**
             * 获取上一次添加的符号
            */
            get: function () {
                return this.lastToken;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "CodeSummary", {
            /**
             * 获取得到代码源文件的大纲概览结构信息
            */
            get: function () {
                return this.summary;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "LastTypeKeyword", {
            /**
             * 上一个追加的单词是一个类型定义或者引用的关键词
            */
            get: function () {
                return this.lastTypeKeyword;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "LastNewLine", {
            /**
             * 上一次添加的符号是一个换行符
            */
            get: function () {
                return this.lastNewLine;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tokenStyler.prototype, "LastDirective", {
            /**
             * 上一次添加的符号是一个预处理符号
            */
            get: function () {
                return this.lastDirective;
            },
            enumerable: true,
            configurable: true
        });
        tokenStyler.prototype.tagClass = function (token, cls) {
            this.lastToken = token;
            return "<span class=\"" + cls + "\">" + token + "</span>";
        };
        tokenStyler.prototype.append = function (token) {
            if (token == " ") {
                this.code.Append("&nbsp;");
            }
            else if (token == "\t") {
                // 是一个TAB
                // 则插入4个空格
                for (var i = 0; i < 4; i++) {
                    this.code.Append("&nbsp;");
                }
            }
            else if (token == "(" || token == "{" || token == ",") {
                this.code.Append(token);
            }
            else {
                // 不计算空格
                this.code.Append(token);
                this.lastTypeKeyword = false;
                this.lastDirective = false;
                this.lastToken = token;
                if (this.parseTOC) {
                    this.summary.insertSymbol(token, vscode.TOC.symbolTypes.symbol, this.lineNumber);
                }
            }
            this.lastNewLine = false;
        };
        /**
         * 生成一个新的table的行对象
        */
        tokenStyler.prototype.appendLine = function (token) {
            if (token === void 0) { token = ""; }
            this.code.AppendLine(token);
            this.lastTypeKeyword = false;
            this.lastNewLine = true;
            this.lastDirective = false;
            this.lastToken = token;
            this.appendNewRow();
        };
        tokenStyler.prototype.buildHashLink = function (L) {
            var vm = this;
            if (this.hashHandler) {
                // 使用用户自定义的页面内跳转处理过程
                return $ts("<a>", {
                    id: "L" + L,
                    href: executeJavaScript,
                    class: "line-hash",
                    onclick: function () {
                        vm.hashHandler(L);
                    }
                });
            }
            else {
                // 使用链接默认的页面内跳转功能
                return $ts("<a>", {
                    id: "L" + L, href: "#L" + L, class: "line-hash"
                });
            }
        };
        /**
         * 尝试将剩余的缓存数据写入结果数据之中
        */
        tokenStyler.prototype.flush = function () {
            if (TypeScript.logging.outputEverything) {
                console.log(this.code);
            }
            if (this.code.Length > 0) {
                this.appendNewRow();
            }
        };
        tokenStyler.prototype.appendNewRow = function () {
            // 构建新的row对象，然后将原来的代码字符串缓存清空
            var L = this.lineNumber;
            var line = $ts("<span>", { class: "line" }).display(L + ": ");
            var hash = this.buildHashLink(L).display(line);
            var snippet = $ts("<td>", { class: "snippet" }).display(this.code.toString());
            var tr = $ts("<tr>").asExtends
                .append($ts("<td>", { class: "lines" }).display(hash))
                .append(snippet);
            this.rowList.push(tr.HTMLElement);
            this.code = new StringBuilder("", "<br />\n");
        };
        tokenStyler.prototype.directive = function (token) {
            this.code.Append(this.tagClass(token, "directive"));
            this.lastTypeKeyword = false;
            this.lastNewLine = false;
            this.lastDirective = true;
        };
        tokenStyler.prototype.type = function (token) {
            this.code.Append(this.tagClass(token, "type"));
            this.lastTypeKeyword = false;
            this.lastNewLine = false;
            this.lastDirective = false;
            if (this.parseTOC) {
                this.summary.insertSymbol(token, vscode.TOC.symbolTypes.symbol, this.lineNumber);
            }
        };
        tokenStyler.prototype.comment = function (token) {
            this.code.AppendLine(this.tagClass(tokenStyler.highlightURLs(token), "comment"));
            this.lastTypeKeyword = false;
            this.lastNewLine = true;
            this.lastDirective = false;
            this.appendNewRow();
        };
        tokenStyler.highlightURLs = function (token) {
            var urls = TypeScript.URL.ParseAllUrlStrings(token);
            var a;
            if (urls.length > 0 && TypeScript.logging.outputEverything) {
                console.log(urls);
            }
            for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
                var url = urls_1[_i];
                a = "<a href=\"" + url + "\">" + url + "</a>";
                token = token.replace(url, a);
            }
            return token;
        };
        /**
         * 可能会存在url
        */
        tokenStyler.prototype.string = function (token) {
            this.code.Append(this.tagClass(tokenStyler.highlightURLs(token), "string"));
            this.lastTypeKeyword = false;
            this.lastNewLine = false;
            this.lastDirective = false;
        };
        tokenStyler.prototype.keyword = function (token) {
            this.code.Append(this.tagClass(token, "keyword"));
            if (vscode.TypeDefine.indexOf(token) > -1) {
                this.lastTypeKeyword = true;
            }
            else {
                this.lastTypeKeyword = false;
            }
            if (this.parseTOC) {
                this.summary.insertSymbol(token, vscode.TOC.symbolTypes.keyword, this.lineNumber);
            }
            this.lastNewLine = false;
            this.lastDirective = false;
        };
        tokenStyler.prototype.attribute = function (token) {
            this.code.Append(this.tagClass(token, "attribute"));
            this.lastTypeKeyword = false;
            this.lastNewLine = false;
            this.lastDirective = false;
        };
        return tokenStyler;
    }());
    vscode.tokenStyler = tokenStyler;
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    /**
     * The VB code syntax token generator
    */
    var VBParser = /** @class */ (function () {
        /**
         * @param chars A chars enumerator
        */
        function VBParser(hashHandler, chars, parseTOC) {
            this.chars = chars;
            this.escapes = {
                string: false,
                comment: false,
                keyword: false // VB之中使用[]进行关键词的转义操作
            };
            this.token = [];
            this.code = new vscode.tokenStyler(hashHandler, parseTOC);
        }
        /**
         * Get source file document highlight result
        */
        VBParser.prototype.GetTokens = function () {
            while (!this.chars.EndRead) {
                this.walkChar(this.chars.Next);
            }
            if (this.token.length > 0) {
                this.walkNewLine();
            }
            this.code.flush();
            return this.code;
        };
        VBParser.peekNextToken = function (chars, allowNewLine) {
            if (allowNewLine === void 0) { allowNewLine = false; }
            var i = 0;
            var c = null;
            while ((c = chars.Peek(i++)) == " " || c == "\n") {
                if ((c == "\n") && !allowNewLine) {
                    break;
                }
            }
            return c;
        };
        Object.defineProperty(VBParser.prototype, "isKeyWord", {
            get: function () {
                return vscode.VBKeywords.indexOf(this.token.join("")) > -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VBParser.prototype, "isAttribute", {
            get: function () {
                var token = this.token;
                var haveTagEnd = token[token.length - 1] == ">" || this.chars.Peek(-1) == "("; // token[token.length - 1] == "(";
                return token[0] == "&lt;" && haveTagEnd;
            },
            enumerable: true,
            configurable: true
        });
        VBParser.prototype.endToken = function () {
            var code = this.code, token = this.token;
            if (this.isAttribute) {
                // 自定义属性需要一些额外的处理
                // 不渲染符号，只渲染单词
                code.append(token[0]);
                if (token[token.length - 1] == ">") {
                    code.attribute($ts(token).Skip(1).Take(token.length - 2).JoinBy(""));
                    code.append(token[token.length - 1]);
                }
                else {
                    code.attribute($ts(token).Skip(1).Take(token.length - 1).JoinBy(""));
                }
            }
            else if (code.LastNewLine && token[0] == "#") {
                code.directive(token.join(""));
            }
            else {
                // 结束当前的单词
                var word = token.join("");
                if (code.LastDirective) {
                    code.directive(word);
                }
                else if (vscode.VBKeywords.indexOf(word) > -1) {
                    // 当前的单词是一个关键词
                    code.keyword(word);
                }
                else if (code.LastTypeKeyword) {
                    if (code.LastAddedToken == "Imports") {
                        // Imports xxx = yyyy
                        if (VBParser.peekNextToken(this.chars) == "=") {
                            code.type(word);
                        }
                        else {
                            code.append(word);
                        }
                    }
                    else if (word == "(") {
                        code.append(word);
                    }
                    else {
                        code.type(word);
                    }
                }
                else {
                    code.append(word);
                }
            }
            this.token = [];
        };
        /**
         * 处理当前的这个换行符
        */
        VBParser.prototype.walkNewLine = function () {
            // 是一个换行符
            if (this.escapes.comment) {
                // vb之中注释只有单行注释，换行之后就结束了                    
                this.code.comment(this.token.join("").replace("<", "&lt;"));
                this.escapes.comment = false;
                this.token = [];
            }
            else if (this.escapes.string) {
                // vb之中支持多行文本字符串，所以继续添加
                // this.token.push("<br />");
                this.code.string(this.token.join(""));
                this.code.appendLine();
                this.token = [];
            }
            else {
                // 结束当前的token
                this.endToken();
                this.code.appendLine();
            }
        };
        VBParser.prototype.walkStringQuot = function () {
            // 可能是字符串的起始
            if (!this.escapes.string) {
                this.escapes.string = true;
                this.endToken();
                this.token.push('"');
            }
            else if (this.escapes.string) {
                // 是字符串的结束符号
                this.escapes.string = false;
                this.token.push('"');
                this.code.string(this.token.join(""));
                this.token = [];
            }
        };
        VBParser.prototype.addToken = function (c) {
            if (c == " ") {
                this.token.push("&nbsp;");
            }
            else if (c == "\t") {
                // 是一个TAB
                // 则插入4个空格
                for (var i = 0; i < 4; i++) {
                    this.token.push("&nbsp;");
                }
            }
            else {
                this.token.push(c);
            }
        };
        VBParser.prototype.walkChar = function (c) {
            var escapes = this.escapes;
            var code = this.code;
            if (c == "\n") {
                this.walkNewLine();
            }
            else if (this.escapes.comment) {
                // 当前的内容是注释的一部分，则直接添加内容
                this.addToken(c);
                // 下面的所有代码都是处理的非注释部分的内容了
                // 代码注释部分的内容已经在处理换行符和上面的代码之中完成了处理操作
            }
            else if (c == '"') {
                this.walkStringQuot();
            }
            else if (c == "'") {
                if (!escapes.string) {
                    // 是注释的起始
                    escapes.comment = true;
                    this.endToken();
                    this.token.push(c);
                }
                else {
                    this.token.push(c);
                }
            }
            else if (c == " " || c == "\t") {
                if (!escapes.string) {
                    // 使用空格进行分词
                    this.endToken();
                    code.append(c);
                }
                else {
                    // 是字符串的一部分
                    this.addToken(c);
                }
            }
            else if (c in vscode.delimiterSymbols) {
                // 也会使用小数点进行分词
                if (!escapes.string) {
                    if (c == "(") {
                        //if (this.isKeyWord) {
                        this.endToken();
                        this.token.push("(");
                        this.endToken();
                        //} else {
                        //    this.endToken();
                        //    this.token.push("(");
                        //    this.endToken();
                        //}
                    }
                    else {
                        this.endToken();
                        code.append(c);
                    }
                }
                else {
                    this.token.push(c);
                }
            }
            else if (c == "<" || c == "&") {
                this.token.push(Strings.escapeXml(c));
            }
            else {
                this.token.push(c);
            }
        };
        return VBParser;
    }());
    vscode.VBParser = VBParser;
})(vscode || (vscode = {}));
/// <reference path="../build/linq.d.ts" />
/// <reference path="CSS.ts" />
/// <reference path="Syntax/tokenStyler.ts" />
/// <reference path="Syntax/VBparser.ts" />
// $ts.mode = Modes.debug;
$ts.mode = Modes.production;
var vscode;
(function (vscode) {
    /**
     * Visual Studio的默认代码渲染样式
    */
    vscode.VisualStudio = vscode.defaultStyle();
    /**
     * All of the VB keywords that following type names
    */
    vscode.TypeDefine = [
        "As", "Class", "Structure", "Module", "Imports", "Of", "New", "GetType", "Implements", "Inherits"
    ];
    /**
     * 在VB.NET之中，单词与单词之间的分隔符列表
    */
    vscode.delimiterSymbols = {
        ".": true,
        ",": true,
        "=": true,
        "(": true,
        ")": true,
        "{": true,
        "}": true
    };
    /**
     * List of VB.NET language keywords
    */
    vscode.VBKeywords = (function (str) {
        var lines = Strings.lineTokens(str.trim());
        var words = $ts(lines)
            .Select(function (s) { return s.split("|"); })
            .Unlist(function (s) { return s; })
            .Where(function (s) { return !Strings.Empty(s) && !Strings.Blank(s); })
            .ToArray();
        if (TypeScript.logging.outputEverything) {
            console.log(words);
        }
        return words;
    })("\n        |AddHandler|AddressOf|Alias|And|AndAlso|As|Ascending|\n        |Boolean|ByRef|Byte|By|\n        |Call|Case|Catch|CBool|CByte|CChar|CDate|CDec|CDbl|Char|CInt|Class|CLng|CObj|Const|Continue|CSByte|CShort|CSng|CStr|CType|CUInt|CULng|CUShort|\n        |Date|Decimal|Declare|Default|Delegate|Dim|DirectCast|Do|Double|Distinct|Descending|\n        |Each|Else|ElseIf|End|EndIf|Enum|Erase|Error|Event|Exit|\n        |False|Finally|For|Friend|Function|From|\n        |Get|GetType|GetXMLNamespace|Global|GoSub|GoTo|\n        |Handles|\n        |If|Implements|Imports|In|Inherits|Integer|Interface|Is|IsNot|\n        |Let|Lib|Like|Long|Loop|\n        |Me|Mod|Module|MustInherit|MustOverride|MyBase|MyClass|My|\n        |Namespace|Narrowing|New|Next|Not|Nothing|NotInheritable|NotOverridable|NameOf|\n        |Object|Of|On|Operator|Option|Optional|Or|OrElse|Overloads|Overridable|Overrides|Order|\n        |ParamArray|Partial|Private|Property|Protected|Public|\n        |RaiseEvent|ReadOnly|ReDim|REM|RemoveHandler|Resume|Return|\n        |SByte|Select|Set|Shadows|Shared|Short|Single|Static|Step|Stop|String|Structure|Sub|SyncLock|\n        |Then|Throw|To|True|Try|TryCast|TypeOf|\n        |Variant|\n        |Wend|\n        |UInteger|ULong|UShort|Using|Union|\n        |When|While|Widening|With|WithEvents|WriteOnly|Where|\n        |Xor|\n        |Yield|\n    ");
    /**
     * 一般用于高亮markdown之中的代码转换结果部分：``<pre class="vbnet">``
    */
    function highlightVB(style, className) {
        if (style === void 0) { style = vscode.VisualStudio; }
        if (className === void 0) { className = ".vbnet"; }
        var codeList = $ts.select(className);
        for (var _i = 0, _a = codeList.ToArray(); _i < _a.length; _i++) {
            var code = _a[_i];
            if (TypeScript.logging.outputEverything) {
                console.log(code.innerText);
            }
            vscode.highlight(code.innerText, code, style, null, false);
            if (code.tagName.toLowerCase() == "pre") {
                code.style.border = "none";
                code.style.padding = "0px";
            }
        }
    }
    vscode.highlightVB = highlightVB;
    function highlightGithub(github, filename, display, style, TOC, hashHandler) {
        if (style === void 0) { style = vscode.VisualStudio; }
        if (TOC === void 0) { TOC = null; }
        if (hashHandler === void 0) { hashHandler = null; }
        var highlight = function (code) {
            var toc = vscode.highlight(code, display, style, hashHandler);
            if (!isNullOrUndefined(toc)) {
                TOC(toc);
            }
        };
        HttpHelpers.GetAsyn(github.RawfileURL(filename), function (code) { return highlight(code); });
    }
    vscode.highlightGithub = highlightGithub;
    /**
     * 解析所给定的VB.NET源代码文件为带格式的高亮HTML文本字符串，然后将HTML文件渲染到指定的id的标签之中
     *
     * @param code VB.NET source code in plain text.
     * @param style 可以传递一个null值来使用css进行样式的渲染
    */
    function highlight(code, display, style, hashhandler, parseTOC) {
        if (style === void 0) { style = vscode.VisualStudio; }
        if (hashhandler === void 0) { hashhandler = null; }
        if (parseTOC === void 0) { parseTOC = true; }
        var pcode = new Pointer(Strings.ToCharArray(code));
        var html = new vscode.VBParser(hashhandler, pcode, parseTOC).GetTokens();
        var container = $ts("<tbody>");
        var preview = $ts("<table>", { class: "pre" }).display(container);
        for (var _i = 0, _a = html.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            container.appendChild(row);
        }
        if (typeof display == "string") {
            $ts(display).display(preview);
        }
        else {
            if (display.tagName == "pre") {
                preview.className = "";
            }
            display.clear();
            display.display(preview);
        }
        if (style) {
            vscode.applyStyle(display, style);
        }
        if (TypeScript.logging.outputEverything) {
            console.log(html.rows);
            console.log(html.CodeSummary.Declares);
        }
        return html.CodeSummary;
    }
    vscode.highlight = highlight;
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    var github;
    (function (github) {
        /**
         * Github 源文件请求帮助模块
        */
        var raw = /** @class */ (function () {
            function raw(user, repo, commit) {
                if (commit === void 0) { commit = "master"; }
                /**
                 * 代码库的版本编号
                */
                this.commit = "master";
                this.username = raw.readValue(user);
                this.repo = raw.readValue(repo);
                this.commit = raw.readValue(commit);
            }
            raw.readValue = function (data) {
                if (data.charAt(0) == "@") {
                    // read data from <meta> tag content
                    return $ts(data);
                }
                else {
                    return data;
                }
            };
            /**
             * 构建生成目标源文件在github上面的位置链接url
            */
            raw.prototype.RawfileURL = function (path) {
                return "https://raw.githubusercontent.com/" + this.username + "/" + this.repo + "/" + this.commit + "/" + path;
            };
            raw.prototype.blame = function (path) {
                return "https://github.com/" + this.username + "/" + this.repo + "/blame/" + this.commit + "/" + path;
            };
            raw.prototype.commitHistory = function (path) {
                return "https://github.com/" + this.username + "/" + this.repo + "/commits/" + this.commit + "/" + path;
            };
            /**
             * @param hashHandler 这个函数接受一个参数，行号
            */
            raw.prototype.highlightCode = function (fileName, display, style, TOC, hashHandler) {
                if (style === void 0) { style = vscode.VisualStudio; }
                if (TOC === void 0) { TOC = null; }
                if (hashHandler === void 0) { hashHandler = null; }
                vscode.highlightGithub(this, fileName, display, style, TOC, hashHandler);
            };
            return raw;
        }());
        github.raw = raw;
    })(github = vscode.github || (vscode.github = {}));
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    var TOC;
    (function (TOC) {
        /**
         * 符号映射
        */
        var CodeMap = /** @class */ (function () {
            /**
             * 构建出一个符号映射
             *
             * @param symbol 对象符号字符串，例如类型名称，属性，函数名称等
             * @param line 目标符号对象在代码源文本之中所处的行编号
            */
            function CodeMap(symbol, line) {
                this.symbol = symbol;
                this.line = line;
            }
            CodeMap.prototype.toString = function () {
                return this.symbol + " at line " + this.line;
            };
            return CodeMap;
        }());
        TOC.CodeMap = CodeMap;
        /**
         * class/structure/enum
        */
        var VBType = /** @class */ (function (_super) {
            __extends(VBType, _super);
            function VBType(symbol, type, line) {
                var _this = _super.call(this, symbol, line) || this;
                _this.fields = [];
                _this.properties = [];
                _this.subs = [];
                _this.functions = [];
                _this.operators = [];
                /**
                 * 在当前类型之中定义的类型
                */
                _this.innerType = [];
                // 获取得到类型声明的类型
                _this.type = type;
                return _this;
            }
            //#region "add methods"
            VBType.prototype.addField = function (symbol, line) {
                this.fields.push(new CodeMap(symbol, line));
            };
            VBType.prototype.addProperty = function (symbol, line) {
                this.properties.push(new CodeMap(symbol, line));
            };
            VBType.prototype.addSub = function (symbol, line) {
                this.subs.push(new CodeMap(symbol, line));
            };
            VBType.prototype.addFunction = function (symbol, line) {
                this.functions.push(new CodeMap(symbol, line));
            };
            VBType.prototype.addOperator = function (symbol, line) {
                this.operators.push(new CodeMap(symbol, line));
            };
            //#endregion
            VBType.prototype.toString = function () {
                return this.type + " " + this.symbol + " at line " + this.line;
            };
            return VBType;
        }(CodeMap));
        TOC.VBType = VBType;
    })(TOC = vscode.TOC || (vscode.TOC = {}));
})(vscode || (vscode = {}));
/**
 * VB.NET源代码文档摘要
*/
var vscode;
(function (vscode) {
    var TOC;
    (function (TOC) {
        /**
         * 在VB之中用于类型申明的关键词
        */
        TOC.typeDeclares = TypeInfo.EmptyObject(["Class", "Structure", "Enum", "Module", "Delegate", "Interface"], true);
        TOC.fieldDeclares = TypeInfo.EmptyObject(["Dim", "Public", "Private", "Friend", "Protected", "ReadOnly", "Const", "Shared"], true);
        TOC.propertyDeclare = "Property";
        TOC.operatorDeclare = "Operator";
        TOC.functionDeclare = "Function";
        TOC.subroutineDeclare = "Sub";
        TOC.endStack = "End";
        TOC.operatorKeywords = TypeInfo.EmptyObject(["And", "Or", "Not", "AndAlso", "OrElse", "Xor", "IsTrue", "IsFalse", "CType", "Like"], true);
        var symbolTypes;
        (function (symbolTypes) {
            /**
             * 普通符号
            */
            symbolTypes[symbolTypes["symbol"] = 2] = "symbol";
            /**
             * VB之中的关键词符号
            */
            symbolTypes[symbolTypes["keyword"] = 1] = "keyword";
        })(symbolTypes = TOC.symbolTypes || (TOC.symbolTypes = {}));
        var declares;
        (function (declares) {
            declares[declares["NA"] = 0] = "NA";
            declares[declares["type"] = 1] = "type";
            declares[declares["field"] = 2] = "field";
            declares[declares["property"] = 3] = "property";
            declares[declares["operator"] = 4] = "operator";
            declares[declares["function"] = 5] = "function";
            declares[declares["sub"] = 6] = "sub";
        })(declares = TOC.declares || (TOC.declares = {}));
        var scopes;
        (function (scopes) {
            scopes[scopes["type"] = 0] = "type";
            scopes[scopes["method"] = 1] = "method";
        })(scopes = TOC.scopes || (TOC.scopes = {}));
        /**
         * 源代码文档概览
        */
        var Summary = /** @class */ (function () {
            function Summary() {
                this.types = [];
                this.typeStack = [];
                this.lastDeclare = declares.NA;
                this.endStack = false;
            }
            Object.defineProperty(Summary.prototype, "Declares", {
                /**
                 * 获取得到当前的源代码文档之中的类型定义信息
                 * 这个列表是最外面的一层类型定义的列表
                */
                get: function () {
                    if (IsNullOrEmpty(this.types) && !isNullOrUndefined(this.current)) {
                        this.types.push(this.current);
                    }
                    return this.types;
                },
                enumerable: true,
                configurable: true
            });
            Summary.prototype.insertSymbol = function (symbol, type, line) {
                if (symbol == "") {
                    return;
                }
                if (type == symbolTypes.keyword) {
                    this.keywordRoutine(symbol, line);
                }
                else {
                    // 是一个普通的符号
                    if (this.lastDeclare != declares.NA) {
                        this.symbolRoutine(symbol, line);
                        this.lastDeclare = declares.NA;
                    }
                }
                this.lastSymbol = symbol;
            };
            Summary.prototype.symbolRoutine = function (symbol, line) {
                // 枚举类型的成员都是字段
                if (!isNullOrUndefined(this.current) && this.lastType == "Enum") {
                    this.current.addField(symbol, line);
                }
                else {
                    // 如果上一个符号是申明符号，则可以构建出一个新的类型或者成员
                    switch (this.lastDeclare) {
                        case declares.field:
                            this.current.addField(symbol, line);
                            break;
                        case declares.function:
                            this.current.addFunction(symbol, line);
                            break;
                        case declares.operator:
                            this.current.addOperator(symbol, line);
                            break;
                        case declares.property:
                            this.current.addProperty(symbol, line);
                            break;
                        case declares.sub:
                            this.current.addSub(symbol, line);
                            break;
                        case declares.type:
                            this.typeDeclare(new TOC.VBType(symbol, this.lastType, line));
                            break;
                        default:
                        // do nothing
                    }
                }
            };
            Summary.prototype.typeDeclare = function (type) {
                if (isNullOrUndefined(this.current)) {
                    if (this.lastType == "Delegate") {
                        // delegate类型没有内部成员，所以stack不需要变化
                        this.lastDeclare = declares.NA;
                        this.endStack = false;
                        this.current = null;
                        this.types.push(type);
                    }
                    else {
                        // 当前的类型数据为空的，则不是内部类型的声明
                        this.current = type;
                    }
                }
                else {
                    // 当前的类型数据不为空，则是当前的类型内的内部类型
                    this.current.innerType.push(type);
                    if (this.lastType == "Delegate") {
                        // delegate类型没有内部成员，所以stack不需要变化
                        this.lastDeclare = declares.NA;
                        this.endStack = false;
                        this.current = null;
                    }
                    else {
                        this.typeStack.push(this.current);
                        this.current = type;
                    }
                }
            };
            Summary.prototype.keywordRoutine = function (symbol, line) {
                if (symbol in TOC.typeDeclares) {
                    if (this.endStack) {
                        // 前面一个符号为结束符
                        if (this.typeStack.length == 0) {
                            // 不是内部类，则直接添加
                            this.types.push(this.current);
                            this.current = null;
                        }
                        else {
                            this.current = this.typeStack.pop();
                        }
                        this.endStack = false;
                    }
                    else {
                        // 新的类型声明
                        this.lastDeclare = declares.type;
                        this.lastType = symbol;
                        this.scope = scopes.type;
                    }
                }
                else if (symbol in TOC.fieldDeclares) {
                    if (this.scope == scopes.type) {
                        // 当前类型之中的字段成员声明
                        this.lastDeclare = declares.field;
                    }
                    else {
                        this.lastDeclare = declares.NA;
                    }
                }
                else if (symbol == TOC.propertyDeclare) {
                    if (this.lastSymbol in TOC.fieldDeclares) {
                        // 当前类型之中的子过程成员声明
                        this.lastDeclare = declares.property;
                        this.scope = scopes.type;
                    }
                    else {
                        this.memberMethodStackRoutine(declares.property);
                    }
                }
                else if (symbol == TOC.operatorDeclare) {
                    this.memberMethodStackRoutine(declares.operator);
                }
                else if (symbol == TOC.functionDeclare) {
                    // delegate function
                    if (this.lastDeclare == declares.type && this.lastType == "Delegate") {
                        // do nothing
                    }
                    else {
                        this.memberMethodStackRoutine(declares.function);
                    }
                }
                else if (symbol == TOC.subroutineDeclare) {
                    // delegate function
                    if (this.lastDeclare == declares.type && this.lastType == "Delegate") {
                        // do nothing
                    }
                    else {
                        this.memberMethodStackRoutine(declares.sub);
                    }
                }
                else if (symbol == TOC.endStack) {
                    this.endStack = true;
                }
                else if (symbol in TOC.operatorKeywords) {
                    this.current.addOperator(symbol, line);
                    this.lastDeclare = declares.NA;
                }
                else {
                    // 什么也不是，重置
                    this.lastDeclare = declares.NA;
                }
            };
            Summary.prototype.memberMethodStackRoutine = function (declareAs) {
                if (this.endStack) {
                    this.scope = scopes.type;
                    this.endStack = false;
                }
                else {
                    if (this.scope == scopes.type) {
                        // 当前类型之中的子过程成员声明
                        this.lastDeclare = declareAs;
                        this.scope = scopes.method;
                    }
                }
            };
            /**
             * 生成当前源代码的大纲目录
            */
            Summary.prototype.TOC = function () {
                return TOC.View.BuildTOC(this);
            };
            Summary.prototype.jsTree = function () {
                return TOC.View.jsTree(this);
            };
            return Summary;
        }());
        TOC.Summary = Summary;
    })(TOC = vscode.TOC || (vscode.TOC = {}));
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    var TOC;
    (function (TOC) {
        var View;
        (function (View) {
            function BuildTOC(summary) {
                var modules = summary.Declares;
                var root = $ts("<ul>");
                for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                    var node = modules_1[_i];
                    root.append(treeNode(node, false));
                }
                return root;
            }
            View.BuildTOC = BuildTOC;
            function codeMapAnchor(symbol, className) {
                var title = $ts("<a>", {
                    class: className,
                    href: "#L" + symbol.line
                }).display(symbol.symbol);
                var item = $ts("<li>").display(title);
                return item;
            }
            function displayTitle(type, isInner) {
                var title;
                if (isInner) {
                    title = $ts("<div>").display(type.type + " " + type.symbol);
                }
                else {
                    title = $ts("<strong>").display(type.type + " " + type.symbol);
                }
                return $ts("<a>", {
                    class: "type",
                    href: "#L" + type.line
                }).display(title);
            }
            function treeNode(type, isInner) {
                if (isInner === void 0) { isInner = true; }
                var title = displayTitle(type, isInner);
                var root = $ts("<li>").display(title);
                if (!IsNullOrEmpty(type.innerType)) {
                    root.append($ts("<p>").display("Internal Types:"));
                    var inner = $ts("<ul>");
                    for (var _i = 0, _a = type.innerType; _i < _a.length; _i++) {
                        var node = _a[_i];
                        inner.append(treeNode(node));
                    }
                    root.append(inner);
                }
                // append members
                codeMapGroup(root, type.fields, "Fields:", "field");
                codeMapGroup(root, type.properties, "Properties:", "property");
                codeMapGroup(root, type.functions, "Functions:", "function");
                codeMapGroup(root, type.subs, "Sub Programs:", "sub");
                codeMapGroup(root, type.operators, "Operators:", "operator");
                return root;
            }
            function codeMapGroup(root, symbols, title, className) {
                if (!IsNullOrEmpty(symbols)) {
                    root.append($ts("<p>").display(title));
                    var inner = $ts("<ul>");
                    for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
                        var node = symbols_1[_i];
                        inner.append(codeMapAnchor(node, className));
                    }
                    root.append(inner);
                }
            }
        })(View = TOC.View || (TOC.View = {}));
    })(TOC = vscode.TOC || (vscode.TOC = {}));
})(vscode || (vscode = {}));
var vscode;
(function (vscode) {
    var TOC;
    (function (TOC) {
        var View;
        (function (View) {
            function jsTree(summary) {
                var treeData = [];
                var hashTable = {};
                typeNodes(summary.Declares, "#", treeData);
                for (var _i = 0, treeData_1 = treeData; _i < treeData_1.length; _i++) {
                    var node = treeData_1[_i];
                    hashTable[node.id] = node.hashLine;
                }
                return {
                    core: {
                        data: treeData
                    },
                    hashSet: hashTable
                };
            }
            View.jsTree = jsTree;
            function typeIcon(type) {
                switch (type.type) {
                    case "Class": return View.Icons.vbclass;
                    case "Module": return View.Icons.vbmodule;
                    case "Interface": return View.Icons.vbinterface;
                    case "Delegate": return View.Icons.vbdelegate;
                    case "Namespace": return View.Icons.vbnamespace;
                    case "Structure": return View.Icons.vbstructure;
                    default:
                        return View.Icons.vbclass;
                }
            }
            function typeNodes(types, parent, tree) {
                for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                    var type = types_1[_i];
                    var typeNode = {
                        icon: typeIcon(type),
                        id: "node_" + (tree.length + 1),
                        parent: parent,
                        text: type.symbol,
                        hashLine: "#L" + type.line
                    };
                    tree.push(typeNode);
                    typeTree(type, typeNode.id, tree);
                }
            }
            function typeTree(type, parent, tree) {
                if (!IsNullOrEmpty(type.innerType)) {
                    typeNodes(type.innerType, parent, tree);
                }
                memberNodes(type.fields, parent, View.Icons.vbfield, tree);
                memberNodes(type.properties, parent, View.Icons.vbproperty, tree);
                memberNodes(type.functions, parent, View.Icons.vbmethod, tree);
                memberNodes(type.subs, parent, View.Icons.vbmethod, tree);
                memberNodes(type.operators, parent, View.Icons.vboperator, tree);
            }
            function memberNodes(members, parent, icon, tree) {
                if (!IsNullOrEmpty(members)) {
                    for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                        var member = members_1[_i];
                        var memberNode = {
                            icon: icon,
                            id: "node_" + (tree.length + 1),
                            parent: parent,
                            text: member.symbol,
                            hashLine: "#L" + member.line
                        };
                        tree.push(memberNode);
                    }
                }
            }
        })(View = TOC.View || (TOC.View = {}));
    })(TOC = vscode.TOC || (vscode.TOC = {}));
})(vscode || (vscode = {}));
/**
 * Visual Studio Icons
*/
var vscode;
(function (vscode) {
    var TOC;
    (function (TOC) {
        var View;
        (function (View) {
            var Icons;
            (function (Icons) {
                function uri(text) {
                    var blanks = /\s+/g;
                    var lines = Strings.lineTokens(text);
                    var dataUri = $ts(lines)
                        .Select(function (line) { return line.replace(blanks, ""); })
                        .JoinBy("");
                    return dataUri;
                }
                Icons.vbclass = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                        7DAAAOwwHHb6hkAAAAhklEQVR4XrWTwQ2AIBAEqcMqLMkGLMGGLMMibMMPgadmH5coOeZMjJdsgMcOYY\n                                        9LbeWcx1LKIWmfuHzzvs6nBBA2b8sgASQ2dyFapZ4ZAW4+L8wPtfkAgGUQCk/S2W52Adi+BsDd8QIygP\n                                        P+s9Y6ue008w3AIUIZAEMMARKF+PmL/z1k8ZhfVF3/7pBb/jcAAAAASUVORK5CYII=");
                Icons.vbnamespace = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                            7EAAAOxAGVKw4bAAABmElEQVR4XnVTsU7CUBS9YGqR9AcYbPwD4wIkxoWtUhgIowvExAjqx6gbi4kz6N\n                                            CYsBDYCJN+AbbdykhbIgXqvS8v8eXxPMnLgXPPPc1r74U0TUFGHMc5PIbw3yBN9lFvVmq8w+NiYYWCI5\n                                            Sc3W63wpqH5x4EZIXmpu/7T91u16zVaiCjXq9Dp9M5Rs8jeeUAQrPf74PrutDr9UAGaZ7nwWAwIEEZkA\n                                            vDEIrFIhQKhQ8UbKFmk1YqlWC5XDKvIoALWSYl+Xw+BA7+O8lkMrDn5/e/QTqbTqegaRpJP7CPSNd1IA\n                                            /iFHuuxCvc2rZtklCtVokmioCJZVlMQO8J0vVfgPDEJEmIDhQBh9vtVnkFwrPjON8kDIdDogtFwDmvAX\n                                            pdpBcWwF/SK9JXuVyGzWbDnqYIOFqv10AexCdegwdIwIljAfIoI2mibzQagRwQG4YBs9kMgiCw5FFeLB\n                                            aX9AXIg4hUc/DWaDTANE1ot9sgo9VqsRp5EO/iRonL9IBnHkVRijwW9DFOKWlz8oi9/62zrlhnvVKp7K\n                                            3zLyx/3SSKVVkEAAAAAElFTkSuQmCC");
                Icons.vbinterface = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                            7DAAAOwwHHb6hkAAAAkElEQVR4Xu1SIQ6EMBDsT+6ewh/4wLkz/ADDOwiWIPsIFBaD5uyJgmgrC9OEzQ\n                                            ICsRI2mXQ7O7PdtFU3CO/92zmnVwQGDZ6LEmttASA/mE1WtkGlFQF78KhD9Bl+/5DXXQRycGiAk3bmcx\n                                            MNkXl9GyogZ6MS3/ZjmMyMlbhY30QXgJnAG4gnEN+B/BXk/+CJBc8mVhfGFRsSAAAAAElFTkSuQmCC");
                Icons.vbmodule = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                         7EAAAOxAGVKw4bAAAAVUlEQVR4Xu2SMQrAMAhFNbh4ot4oa86StTfKiRwtHUoCDkIkBELfIMiXj/hFVY\n                                         UI9BYRmXJhZqSvKddtBmrLrpYgwCEGNB7F0LW1G9ioLBtj/P/A5wEG9hVnmCDA8wAAAABJRU5ErkJggg\n                                         ==");
                Icons.vbmethod = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                         7EAAAOxAGVKw4bAAACFUlEQVR4Xp2Tz4sScRjGH2UPoWFBC97qHrg3s5Mrmkx509us5OxJ2iYz135snb\n                                         ZNKlwT1iIQvJQdFJJAFLwpG3jph+sG/QHCejDJUdODYN/emcMwDkbQA88ww/B5Zr4vzwvGGPSaTqdnyb\n                                         vj8Vjq9Xq/6f4N+QJ0ktkVHXgaQHw+n8fq9fqZYrGIwWCAQCAQIvMU8hpAwmQy9bUpCkjeoS/2y+UyCw\n                                         aDTBAEVq1W2edPX1gsFmN+v58VCgU2Go3G8t/JjMwqAZPJpF+r1RbAwU+JSYOh6sPDjywcDjOe51mlUm\n                                         HE/FCPYDAYziWTSZjNZty/9wA2mw16rdnW8GQvgcd7u0in03C73asgGaERz28g9WIfz54/Rbd7Aq2Ojl\n                                         qIbd8BzUeLLA7Rd82Hdec6SqX3iN+Nw+PxwOv10nMJ7XYbm8Im7PZLCAnX9QGqlGOEQgI47iry7/KgAV\n                                         LQFbzMvILFYpHnBa2M+IusViu2bmxBlnhTVOBlMuL/tDzg+Nvxv4DlR2CMnUQiEaRS+zjIHGA4HC6FW6\n                                         0WHj7agcvlArV1BkDtwUWO4xIOh0PM5XLGyO1bEGiQDsdlBZzNZjTQt2g0GhBFEU6n8zuADbXKml2wk7\n                                         82m025lUrzqDBKO6PRKOt0OozeZ8inVJYu+k1cIW9LkvQrm80yn8/H8vm8XN0ugRw00gfog86TyxTECP\n                                         xAXl22zn8AcMBI8DVOMowAAAAASUVORK5CYII=");
                Icons.vbfield = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                        7EAAAOxAGVKw4bAAABPUlEQVR4XrWSsUvDQBjFv5OCcIKDCuogCM4NAeni5hAcFR0Ewb9Ap6KdBCsoKI\n                                        g4OLoVBwctQZ06qYtLLSSb0EEU6iC2Be/W83vBQuBiDIgPHnzf++79skTQD9Ja4zZvDG1jF4J2ePellI\n                                        agtCJ7QSndOL9/Mk7xIjJmZLgBnqnola9N2GzBmBNBqcVOuxu3BeJeI0dEj1f1V3evGtLoYD+drc3QxJ\n                                        CkNAXPbVo+viNdWXEBcLFAXn4ssfDyoalYqVMtfLNuufiCB/nSTQQ6Wp1GZBVTADYoi/pSbv8HKEwNk7\n                                        85i1EBoLAgzFq8Lc8pzxk/4GgS/8EIe5/96T80TaFUNbR0GneU4YY3eItODyp6w3e4wV6vBa2B3cuAoK\n                                        1Fh/hriscT9qGU8h25BUgCYbeKWQUQ/FtBGGPoL/oCOaj4maA22jgAAAAASUVORK5CYII=");
                Icons.vbproperty = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                           7EAAAOxAGVKw4bAAABHUlEQVR4Xo2SMWqFQBCGZ5dU2qTS3hO80jKItSQ3SEDsFFtB8AUEywh2NskN3j\n                                           uAB7D0BPZqk0bbl50l6oPoxB8Gcdnv/2eYZUBomqZnAEhEnWBVI+pdUZQrAoyAz33fJ2VZQl3XCx3HMZ\n                                           imCb8mZ7aXLOCL7/swjuMC27YNYRjeAy8ctoXJFDx3lewZnPDCvRzHWeA8zyFNU3mPw0FFUQRt20q4qq\n                                           oFeDjIy3GCIPhzzjdW94qXdV0HQvMmGr4Bf2K7Xdftwqqqgud5cpV8C8ZZZ62drMlFUYCmafIxMQo2DA\n                                           OyLJOJey9RwsMw3FzXvVmWtRT+4zmaAyEc4YNIfhNJX/8ZPB6ASYNvhAiYFBMzPgn2gp2gmSiEr3BQPw\n                                           BwoN8BzQiLAAAAAElFTkSuQmCC");
                Icons.vboperator = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                           7EAAAOxAGVKw4bAAAAyklEQVR4Xr1TMQoCQQzMHoJyhYogNoovsBT8w1UWNoKFINjZ+gb9gSBYCDYW2v\n                                           gHwVJ/oI0I4lkExWLFhTm4VLcrOrBLSJgkk+wqZtb0BVKfy+8snMg8b5MnnbdpiyyABF9KQGVpVwdrCv\n                                           klu0IsniDfW4Ic2UpFMTcJWtvNANX+O0RPrDB2AMzjMA6Mv5hNiy0kaH8/Cqhc8Kk72dLl/rST0KxXDP\n                                           l0ZVrtjuIdCAmyo1IuQ7N+w5Brww1CySWcwwf8P3rK+FWueAMBAUSsTmsB9QAAAABJRU5ErkJggg==");
                Icons.vbdelegate = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                           7EAAAOxAGVKw4bAAAA7klEQVR4Xu2SsYrCQBCGZ3MYuKB9iryCdmInYhPxFeSKFIKdhfgUNlceaSyCr6\n                                           CxOcTWzt4uFlpYmRUiZm/m2IUQWYho6Qc/YSfz/dUwyME5b+EnwDi5XxHmy7KsVVYw4J7AH4XOsOFDNj\n                                           STxXo45yyOuehXv0W0Owh8/+e4P9FMvSt5ycYsMKkUsstCM0ulYzOSf2fbzvxnA9fkBkUomR/QHdSh3a\n                                           uFBgqukotCu+SQSwVMyZO1B59lUyuqHUI6zIAneVHBu0DQYRDj5hQu50QrqB1COoIKlnhVavDQJZLL6J\n                                           5RoFoXw6AYgmSM9wcPYZvgS2IeIQAAAABJRU5ErkJggg==");
                Icons.vbstructure = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                            7EAAAOxAGVKw4bAAAAWUlEQVR4XtVT7QrAIAjM8I89YrCnG+wR86fRYDAa9CVRO1CQQ7njEETEaGCNEp\n                                            gaMw/JICLAZ3DH1bUcTq+2sMkBfHmaogDuKuCTQq6oxtuGrP+eQo1f/40RbSkZGavw6UEAAAAASUVORK\n                                            5CYII=");
                Icons.vbIcon = uri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA\n                                       7DAAAOwwHHb6hkAAAA6UlEQVR4Xu1SvQ4BQRC+N+ANeALxBN5ApaXWKERLoVJoTn2RSCSikis0rqFQKe\n                                       QaiZJoFCQn2fsp18xkjRE5ejHJ5L6d++abn13rRyyOY/3wKIpGgG3EH9wOgiD7ImBVhjpXn2ql1AHOfq\n                                       E1w9ibZ2pj7Xg7EmEBqLoq9xZE2J8u+ny9ETYxcm975HOpM9eYIwWaoEpE/AosBTCRcMNZYwcuCyRJkp\n                                       dVq4MlYYiljcAdsJm5kYC7oGpmNywmO6J/0kCx23d9JgAmkhyhPdmkC4RhWIQFMgEwkr6PIM1cISUyFi\n                                       7fyvMd/O0On1xdHoEvwbIAAAAASUVORK5CYII=");
            })(Icons = View.Icons || (View.Icons = {}));
        })(View = TOC.View || (TOC.View = {}));
    })(TOC = vscode.TOC || (vscode.TOC = {}));
})(vscode || (vscode = {}));
//# sourceMappingURL=vbcode.js.map