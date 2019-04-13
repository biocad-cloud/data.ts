/// <reference path="../../ts/build/linq.d.ts" />
/// <reference types="jstree" />
declare namespace vscode {
    interface CSS {
        string: string;
        comment: string;
        keyword: string;
        attribute: string;
        /**
         * 用户类型的颜色样式值
        */
        type: string;
        directive: string;
        globalFont: CanvasHelper.CSSFont;
    }
    function defaultStyle(): CSS;
    function applyStyle(div: string | IHTMLElement, style?: CSS): void;
}
declare namespace vscode {
    /**
     * 输出的是一个``table``对象的html文本
    */
    class tokenStyler {
        private hashHandler;
        private parseTOC;
        private code;
        private rowList;
        /**
         * 上一个追加的单词是一个类型定义或者引用的关键词
        */
        private lastTypeKeyword;
        private lastNewLine;
        private lastDirective;
        private lastToken;
        private summary;
        readonly rows: HTMLTableRowElement[];
        /**
         * 获取当前的符号所处的行号
        */
        readonly lineNumber: number;
        /**
         * 获取上一次添加的符号
        */
        readonly LastAddedToken: string;
        /**
         * 获取得到代码源文件的大纲概览结构信息
        */
        readonly CodeSummary: TOC.Summary;
        /**
         * 上一个追加的单词是一个类型定义或者引用的关键词
        */
        readonly LastTypeKeyword: boolean;
        /**
         * 上一次添加的符号是一个换行符
        */
        readonly LastNewLine: boolean;
        /**
         * 上一次添加的符号是一个预处理符号
        */
        readonly LastDirective: boolean;
        constructor(hashHandler: Delegate.Sub, parseTOC: boolean);
        private tagClass;
        append(token: string): void;
        /**
         * 生成一个新的table的行对象
        */
        appendLine(token?: string): void;
        private buildHashLink;
        /**
         * 尝试将剩余的缓存数据写入结果数据之中
        */
        flush(): void;
        private appendNewRow;
        directive(token: string): void;
        type(token: string): void;
        comment(token: string): void;
        private static highlightURLs;
        /**
         * 可能会存在url
        */
        string(token: string): void;
        keyword(token: string): void;
        attribute(token: string): void;
    }
}
declare namespace vscode {
    /**
     * The VB code syntax token generator
    */
    class VBParser {
        private chars;
        private code;
        private escapes;
        private token;
        /**
         * @param chars A chars enumerator
        */
        constructor(hashHandler: Delegate.Sub, chars: Pointer<string>, parseTOC: boolean);
        /**
         * Get source file document highlight result
        */
        GetTokens(): tokenStyler;
        private static peekNextToken;
        private readonly isKeyWord;
        private readonly isAttribute;
        private endToken;
        /**
         * 处理当前的这个换行符
        */
        private walkNewLine;
        private walkStringQuot;
        private addToken;
        private walkChar;
    }
}
declare namespace vscode {
    /**
     * Visual Studio的默认代码渲染样式
    */
    const VisualStudio: CSS;
    /**
     * All of the VB keywords that following type names
    */
    const TypeDefine: string[];
    /**
     * 在VB.NET之中，单词与单词之间的分隔符列表
    */
    const delimiterSymbols: {
        ".": boolean;
        ",": boolean;
        "=": boolean;
        "(": boolean;
        ")": boolean;
        "{": boolean;
        "}": boolean;
    };
    /**
     * List of VB.NET language keywords
    */
    const VBKeywords: string[];
    /**
     * 一般用于高亮markdown之中的代码转换结果部分：``<pre class="vbnet">``
    */
    function highlightVB(style?: CSS, className?: string): void;
    function highlightGithub(github: github.raw, filename: string, display: string | IHTMLElement, style?: CSS, TOC?: (toc: TOC.Summary) => void, hashHandler?: Delegate.Sub): void;
    /**
     * 解析所给定的VB.NET源代码文件为带格式的高亮HTML文本字符串，然后将HTML文件渲染到指定的id的标签之中
     *
     * @param code VB.NET source code in plain text.
     * @param style 可以传递一个null值来使用css进行样式的渲染
    */
    function highlight(code: string, display: string | IHTMLElement, style?: CSS, hashhandler?: Delegate.Sub, parseTOC?: boolean): TOC.Summary;
}
declare namespace vscode.github {
    /**
     * Github 源文件请求帮助模块
    */
    class raw {
        username: string;
        repo: string;
        /**
         * 代码库的版本编号
        */
        commit: string;
        constructor(user: string, repo: string, commit?: string);
        private static readValue;
        /**
         * 构建生成目标源文件在github上面的位置链接url
        */
        RawfileURL(path: string): string;
        blame(path: string): string;
        commitHistory(path: string): string;
        /**
         * @param hashHandler 这个函数接受一个参数，行号
        */
        highlightCode(fileName: string, display: string | IHTMLElement, style?: CSS, TOC?: (toc: TOC.Summary) => void, hashHandler?: Delegate.Sub): void;
    }
}
declare namespace vscode.TOC {
    /**
     * 符号映射
    */
    class CodeMap {
        symbol: string;
        line: number;
        /**
         * 构建出一个符号映射
         *
         * @param symbol 对象符号字符串，例如类型名称，属性，函数名称等
         * @param line 目标符号对象在代码源文本之中所处的行编号
        */
        constructor(symbol: string, line: number);
        toString(): string;
    }
    /**
     * class/structure/enum
    */
    class VBType extends CodeMap {
        fields: CodeMap[];
        properties: CodeMap[];
        subs: CodeMap[];
        functions: CodeMap[];
        operators: CodeMap[];
        /**
         * 在当前类型之中定义的类型
        */
        innerType: VBType[];
        /**
         * 类，结构体或者枚举？
        */
        type: string;
        constructor(symbol: string, type: string, line: number);
        addField(symbol: string, line: number): void;
        addProperty(symbol: string, line: number): void;
        addSub(symbol: string, line: number): void;
        addFunction(symbol: string, line: number): void;
        addOperator(symbol: string, line: number): void;
        toString(): string;
    }
}
/**
 * VB.NET源代码文档摘要
*/
declare namespace vscode.TOC {
    /**
     * 在VB之中用于类型申明的关键词
    */
    const typeDeclares: {};
    const fieldDeclares: {};
    const propertyDeclare: string;
    const operatorDeclare: string;
    const functionDeclare: string;
    const subroutineDeclare: string;
    const endStack: string;
    const operatorKeywords: {};
    enum symbolTypes {
        /**
         * 普通符号
        */
        symbol = 2,
        /**
         * VB之中的关键词符号
        */
        keyword = 1
    }
    enum declares {
        NA = 0,
        type = 1,
        field = 2,
        property = 3,
        operator = 4,
        function = 5,
        sub = 6
    }
    enum scopes {
        type = 0,
        method = 1
    }
    /**
     * 源代码文档概览
    */
    class Summary {
        private types;
        private typeStack;
        private current;
        private lastDeclare;
        private lastType;
        private endStack;
        private scope;
        private lastSymbol;
        /**
         * 获取得到当前的源代码文档之中的类型定义信息
         * 这个列表是最外面的一层类型定义的列表
        */
        readonly Declares: VBType[];
        insertSymbol(symbol: string, type: symbolTypes, line: number): void;
        private symbolRoutine;
        private typeDeclare;
        private keywordRoutine;
        private memberMethodStackRoutine;
        /**
         * 生成当前源代码的大纲目录
        */
        TOC(): HTMLElement;
        jsTree(): JSTreeStaticDefaults;
    }
}
declare namespace vscode.TOC.View {
    function BuildTOC(summary: Summary): HTMLElement;
}
declare namespace vscode.TOC.View {
    function jsTree(summary: Summary): JSTreeStaticDefaults;
    interface treeNode {
        icon: string;
        id: string;
        parent: string;
        text: string;
        hashLine: string;
    }
}
/**
 * Visual Studio Icons
*/
declare namespace vscode.TOC.View.Icons {
    const vbclass: string;
    const vbnamespace: string;
    const vbinterface: string;
    const vbmodule: string;
    const vbmethod: string;
    const vbfield: string;
    const vbproperty: string;
    const vboperator: string;
    const vbdelegate: string;
    const vbstructure: string;
    const vbIcon: string;
}
