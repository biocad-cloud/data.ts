/// <reference path="../Linq/Pointer.ts" />

namespace csv {

    /**
     * 通过Chars枚举来解析域，分隔符默认为逗号
     * > https://github.com/xieguigang/sciBASIC/blame/701f9d0e6307a779bb4149c57a22a71572f1e40b/Data/DataFrame/IO/csv/Tokenizer.vb#L97
     * 
    */
    export function CharsParser(s: string, delimiter: string = ",", quot: string = '"'): string[] {
        var tokens: string[] = [];
        var temp: string[] = [];
        var openStack: boolean = false;
        var buffer: Pointer<string> = From(DataExtensions.ToCharArray(s)).ToPointer();
        var dblQuot: string = quot + quot;

        while (!buffer.EndRead) {

        }

        if (temp.length > 0) {
            tokens.push(temp.join().replace(dblQuot, quot));
        }

        return tokens;
    }


}