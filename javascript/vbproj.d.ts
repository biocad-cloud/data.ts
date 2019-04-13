/// <reference path="../../ts/build/linq.d.ts" />
/// <reference path="../../ts/build/vbcode.d.ts" />
/// <reference path="../../ts/build/marked.d.ts" />
declare module CodeEditor.Navigate {
    interface IJsTreeTerm {
        icon: string;
        id: string;
        parent: string;
        text: string;
        type: string;
    }
    function HashParser(hash?: string): Reference;
    interface Reference {
        fileName: string;
        line: number;
    }
    function Do(callback?: Delegate.Sub): void;
    function JumpToLine(line: number): void;
}
declare module CodeEditor {
    function highLightVBfile(file: string, callback?: Delegate.Sub): void;
    function doLineHighlight(L: number): void;
    function requestGithubFile(fileName: string, callback: Delegate.Sub): void;
    function githubImageURL(href: string): string;
}
declare module CodeEditor {
    class MDRender extends markedjs.htmlRenderer {
        image(href: string, title: string, text: string): string;
    }
}
declare namespace CodeEditor.Search {
    /**
     * 将结果显示到网页上面
    */
    function makeSuggestions(terms: term[], div: string, click: (term: term) => void, top?: number, caseInsensitive?: boolean): (input: string) => void;
    function showSuggestions(suggestion: suggestion, input: string, div: string, click: (term: term) => void, top?: number, caseInsensitive?: boolean): void;
    function listItem(term: term, click: (term: term) => void): HTMLElement;
}
declare namespace CodeEditor.Search {
    class suggestion {
        private terms;
        constructor(terms: term[]);
        /**
         * 返回最相似的前5个结果
        */
        populateSuggestion(input: string, top?: number, caseInsensitive?: boolean): term[];
        private static getScore;
    }
}
declare namespace CodeEditor.Search {
    const NA: number;
    /**
     * Term for suggestion
    */
    class term {
        id: number | string;
        term: string;
        /**
         * @param id 这个term在数据库之中的id编号
        */
        constructor(id: number | string, term: string);
        /**
         * 使用动态规划算法计算出当前的这个term和用户输入之间的相似度
        */
        dist(input: string): number;
        static indexOf(term: string, input: string): number;
    }
    class scoreTerm {
        score: number;
        term: term;
        constructor(term: term, score: number);
    }
}
