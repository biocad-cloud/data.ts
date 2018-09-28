namespace Linq.DOM {

    export const attrs: RegExp = /\S+\s*[=]\s*((["].*["])|(['].*[']))/g;

    export function ParseNodeDeclare(expr: string) {
        // <a href="..." onclick="...">
        var declare: string = expr
            .substr(1, expr.length - 2)
            .trim();
        var tagValue = Strings.GetTagValue(declare, " ");
        var tag: string = tagValue.name;
        var attrs: NamedValue<string>[] = [];

        if (tagValue.value.length > 0) {
            // 使用正则表达式进行解析
            attrs = From(tagValue.value.match(DOM.attrs))
                .Where(s => s.length > 0)
                .Select(s => {
                    var attr = Strings.GetTagValue(s, "=");
                    var val: string = attr.value.trim();
                    val = val.substr(1, val.length - 2);
                    return new NamedValue(attr.name, val);
                }).ToArray();
        }

        return {
            tag: tag, attrs: attrs
        };
    }
}