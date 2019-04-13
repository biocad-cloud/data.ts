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
var CodeEditor;
(function (CodeEditor) {
    var Navigate;
    (function (Navigate) {
        function HashParser(hash) {
            if (hash === void 0) { hash = window.location.hash; }
            if (Strings.Empty(hash, true)) {
                return null;
            }
            else {
                var tokens = hash.substr(1).split("#");
                var line = -1;
                var path = tokens[0];
                if (tokens.length > 1) {
                    line = parseInt(/\d+/.exec(tokens[1])[0]);
                }
                if (path.charAt(0) == "/") {
                    path = path.substr(1);
                }
                return { fileName: path, line: line };
            }
        }
        Navigate.HashParser = HashParser;
        function Do(callback) {
            if (callback === void 0) { callback = null; }
            var input = Navigate.HashParser();
            if (!isNullOrUndefined(input)) {
                CodeEditor.highLightVBfile(input.fileName, function () {
                    if (input.line > 0) {
                        $ts.location.hash(false, "#/" + input.fileName + "#L" + input.line);
                        JumpToLine(input.line);
                    }
                    if (callback) {
                        callback();
                    }
                });
            }
        }
        Navigate.Do = Do;
        function JumpToLine(line) {
            window.scrollTo(0, 16 * line);
        }
        Navigate.JumpToLine = JumpToLine;
    })(Navigate = CodeEditor.Navigate || (CodeEditor.Navigate = {}));
})(CodeEditor || (CodeEditor = {}));
var CodeEditor;
(function (CodeEditor) {
    var github = new vscode.github.raw("@github.user", "@github.repo", "@github.commits");
    var previousHighlight = null;
    function highLightVBfile(file, callback) {
        if (callback === void 0) { callback = null; }
        var handleTOC = function (summary) {
            var toc = summary.jsTree();
            var hash = toc.hashSet;
            var click = function (e, data) {
                var line = hash[data.selected[0]];
                var jump = "#/" + file + line;
                var n = parseInt(/\d+/.exec(line)[0]);
                $ts.location.hash(false, jump);
                CodeEditor.Navigate.JumpToLine(n);
            };
            $ts.location.hash(false, "#/" + file);
            $('#toc-tree').jstree("destroy").empty();
            $('#toc-tree').jstree(toc);
            $('#toc-tree').on("changed.jstree", click);
            if (!isNullOrUndefined(callback)) {
                callback();
            }
        };
        var handleHash = function (L) {
            $ts.location.hash(false, "#/" + file + "#L" + L);
            CodeEditor.Navigate.JumpToLine(L);
            doLineHighlight(L);
        };
        github.highlightCode(file, "#vbcode", vscode.VisualStudio, handleTOC, handleHash);
        $ts("#md-text").hide();
        $ts("#ca-viewsource").href = github.RawfileURL(file);
        $ts("#ca-history").href = github.commitHistory(file);
        $ts("#ca-blame").href = github.blame(file);
    }
    CodeEditor.highLightVBfile = highLightVBfile;
    function doLineHighlight(L) {
        var line = $ts("#L" + L).parentElement.parentElement;
        line.style.backgroundColor = "#FFD801";
        if (previousHighlight) {
            previousHighlight.style.backgroundColor = null;
        }
        previousHighlight = line;
    }
    CodeEditor.doLineHighlight = doLineHighlight;
    function requestGithubFile(fileName, callback) {
        $ts.getText(github.RawfileURL(fileName), callback);
    }
    CodeEditor.requestGithubFile = requestGithubFile;
    function githubImageURL(href) {
        var url = href.toLowerCase();
        var isFullName = href.toLowerCase().indexOf("http://") > -1 || href.toLowerCase().indexOf("https://") > -1;
        if (TypeScript.logging.outputEverything) {
            console.log(url + " is full path? " + isFullName);
        }
        if (isFullName) {
            return href;
        }
        else {
            return github.RawfileURL(href);
        }
    }
    CodeEditor.githubImageURL = githubImageURL;
})(CodeEditor || (CodeEditor = {}));
/// <reference path="../build/linq.d.ts" />
/// <reference path="../build/vbcode.d.ts" />
/// <reference path="./Navigate.ts" />
/// <reference path="./Editor.ts" />
/// <reference path="../build/marked.d.ts" />
$ts.mode = Modes.debug;
$ts("#file-suggest-list").hide();
$ts.get("projects/Microsoft.VisualBasic.Core.json", function (data) {
    var assembly = data["assembly"];
    var tree = new Dictionary(data["tree"])
        .Values
        .ToArray(false);
    var vbprojfiles = data["path"];
    var nodeIDlist = Object.keys(vbprojfiles);
    var line = CodeEditor.Navigate.HashParser();
    var indexTerms = $ts(tree)
        .Where(function (t) { return t.type != "folder"; })
        .Select(function (t) { return new CodeEditor.Search.term(t.id, t.text); })
        .ToArray(false);
    var showFileById = function (nodeID) {
        CodeEditor.highLightVBfile(vbprojfiles[nodeID].replace("\\", "/"));
    };
    var suggests = CodeEditor.Search.makeSuggestions(indexTerms, "#file-suggest-list", function (term) { return showFileById(term.id); }, 10, true);
    var randomFile = function () {
        showFileById(nodeIDlist[Math.floor(Math.random() * nodeIDlist.length)]);
    };
    TypeScript.logging.log(tree);
    TypeScript.logging.log(assembly);
    $('#vbproj-tree').jstree({
        core: {
            data: tree
        }
    });
    $('#vbproj-tree').on("changed.jstree", function (e, data) {
        showFileById(data.selected[0]);
    });
    var searchInputHandler = function () {
        var search = $ts("#searchInput").CType().value;
        if (TypeScript.logging.outputEverything) {
            console.log(search);
        }
        if (search) {
            $ts("#vbproj-tree").hide();
            $ts("#file-suggest-list").show();
            suggests(search);
        }
        else {
            $ts("#vbproj-tree").show();
            $ts("#file-suggest-list").hide();
        }
    };
    $ts("#random-file").onclick = randomFile;
    $ts("#searchInput").onkeypress = searchInputHandler;
    $ts("#searchInput").onchange = searchInputHandler;
    if (!isNullOrUndefined(line)) {
        CodeEditor.Navigate.Do(function () {
            if (line && line.line > 0) {
                CodeEditor.doLineHighlight(line.line);
            }
            $ts("#md-text").hide();
        });
    }
    else {
        // 首页，则显示assembly信息
        var info_1 = $ts("#md-text");
        var opt_1 = markedjs.option.Defaults;
        opt_1.renderer = new CodeEditor.MDRender();
        opt_1.debug = false;
        CodeEditor.requestGithubFile("README.md", function (markdown) {
            info_1.display(marked(markdown, opt_1, null));
            vscode.highlightVB(vscode.VisualStudio, ".language-vbnet");
        });
    }
});
window.onhashchange = CodeEditor.Navigate.Do;
var CodeEditor;
(function (CodeEditor) {
    var MDRender = /** @class */ (function (_super) {
        __extends(MDRender, _super);
        function MDRender() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDRender.prototype.image = function (href, title, text) {
            href = markedjs.helpers.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            else {
                href = CodeEditor.githubImageURL(href);
            }
            var out = '<img style="max-width: 65%;" src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            // out = `<div style="width: 100%; text-align: center;">${out}</div>`;
            return out;
        };
        return MDRender;
    }(markedjs.htmlRenderer));
    CodeEditor.MDRender = MDRender;
})(CodeEditor || (CodeEditor = {}));
var CodeEditor;
(function (CodeEditor) {
    var Search;
    (function (Search) {
        /**
         * 将结果显示到网页上面
        */
        function makeSuggestions(terms, div, click, top, caseInsensitive) {
            if (top === void 0) { top = 10; }
            if (caseInsensitive === void 0) { caseInsensitive = false; }
            var suggestions = new Search.suggestion(terms);
            return function (input) {
                // console.log(input);
                showSuggestions(suggestions, input, div, click, top, caseInsensitive);
            };
        }
        Search.makeSuggestions = makeSuggestions;
        function showSuggestions(suggestion, input, div, click, top, caseInsensitive) {
            if (top === void 0) { top = 10; }
            if (caseInsensitive === void 0) { caseInsensitive = false; }
            var node = $ts(div);
            if (!node) {
                console.error("Unable to find node which its id equals to: " + div);
                return;
            }
            else {
                node.innerHTML = "";
            }
            suggestion.populateSuggestion(input, top, caseInsensitive)
                .forEach(function (term) {
                node.appendChild(listItem(term, click));
            });
        }
        Search.showSuggestions = showSuggestions;
        function listItem(term, click) {
            var a = $ts("<a>", {
                onclick: function () { return click(term); },
                href: "#",
                title: term.term
            });
            a.innerText = term.term;
            return $ts("<div>").display(a);
        }
        Search.listItem = listItem;
    })(Search = CodeEditor.Search || (CodeEditor.Search = {}));
})(CodeEditor || (CodeEditor = {}));
/// <reference path="../../build/linq.d.ts" />
var CodeEditor;
(function (CodeEditor) {
    var Search;
    (function (Search) {
        var suggestion = /** @class */ (function () {
            function suggestion(terms) {
                this.terms = terms;
            }
            /**
             * 返回最相似的前5个结果
            */
            suggestion.prototype.populateSuggestion = function (input, top, caseInsensitive) {
                if (top === void 0) { top = 5; }
                if (caseInsensitive === void 0) { caseInsensitive = false; }
                var lowerInput = input.toLowerCase();
                var scores = From(this.terms)
                    .Select(function (q) {
                    var score = suggestion.getScore(q, input, lowerInput, caseInsensitive);
                    return new Search.scoreTerm(q, score);
                })
                    .OrderBy(function (rank) { return rank.score; });
                var result = scores
                    .Where(function (s) { return s.score != Search.NA; })
                    .Take(top)
                    .Select(function (s) { return s.term; })
                    .ToArray();
                if (result.length <= top) {
                    return result;
                }
                else {
                    // 非NA得分的少于top的数量
                    // 需要换一种方式计算结果，然后进行补充
                    var addi = scores
                        .Skip(result.length)
                        .Select(function (s) {
                        var q = s.term;
                        var score;
                        if (caseInsensitive) {
                            score = Levenshtein.ComputeDistance(q.term.toLowerCase(), lowerInput);
                        }
                        else {
                            score = Levenshtein.ComputeDistance(q.term, input);
                        }
                        return new Search.scoreTerm(q, score);
                    }).OrderBy(function (s) { return s.score; })
                        .Take(top - result.length)
                        .Select(function (s) { return s.term; })
                        .ToArray();
                    result = result.concat(addi);
                }
                return result;
            };
            suggestion.getScore = function (q, input, lowerInput, caseInsensitive) {
                if (caseInsensitive) {
                    // 大小写不敏感的模式下，都转换为小写
                    var lowerTerm = q.term.toLowerCase();
                    return Search.term.indexOf(lowerTerm, lowerInput);
                }
                else {
                    return q.dist(input);
                }
            };
            return suggestion;
        }());
        Search.suggestion = suggestion;
    })(Search = CodeEditor.Search || (CodeEditor.Search = {}));
})(CodeEditor || (CodeEditor = {}));
var CodeEditor;
(function (CodeEditor) {
    var Search;
    (function (Search) {
        Search.NA = 100000000000;
        /**
         * Term for suggestion
        */
        var term = /** @class */ (function () {
            /**
             * @param id 这个term在数据库之中的id编号
            */
            function term(id, term) {
                this.id = id;
                this.term = term;
                this.id = id;
                this.term = term;
            }
            /**
             * 使用动态规划算法计算出当前的这个term和用户输入之间的相似度
            */
            term.prototype.dist = function (input) {
                return term.indexOf(this.term, input);
            };
            term.indexOf = function (term, input) {
                var i = term.indexOf(input);
                if (i == -1) {
                    return Search.NA;
                }
                else {
                    return Math.abs(input.length - term.length);
                }
            };
            return term;
        }());
        Search.term = term;
        var scoreTerm = /** @class */ (function () {
            function scoreTerm(term, score) {
                this.term = term;
                this.score = score;
            }
            return scoreTerm;
        }());
        Search.scoreTerm = scoreTerm;
    })(Search = CodeEditor.Search || (CodeEditor.Search = {}));
})(CodeEditor || (CodeEditor = {}));
//# sourceMappingURL=vbproj.js.map