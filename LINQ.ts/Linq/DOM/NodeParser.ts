namespace Linq.DOM {

    export function ParseNodeDeclare(expr: string) {
        var tag: string;
        var attrs: NamedValue<string>[] = [];

        return {
            tag: tag, attrs: attrs
        };
    }
}