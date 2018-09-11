namespace Linq.TsQuery {

    export const handler = {
        string: () => new stringEval(),
        array: () => new arrayEval()
    };

    export interface IEval<T> {
        doEval(expr: T, type: TypeInfo): any;
    }

    export class stringEval implements IEval<string> {

        public static getQueryType(expr: string): NamedValue<DomQueryTypes> {
            if (expr.charAt(0) == "#") {
                return new NamedValue<DomQueryTypes>(expr.substr(1), DomQueryTypes.id);
            } else if (expr.charAt(0) == ".") {
                return new NamedValue<DomQueryTypes>(expr.substr(1), DomQueryTypes.class);
            } else {
                return new NamedValue<DomQueryTypes>(expr, DomQueryTypes.tagName);
            }
        }

        doEval(expr: string, type: TypeInfo): any {
            var query = stringEval.getQueryType(expr);

            // console.log(query);
            // console.log(query.value == DomQueryTypes.id);

            if (query.value == DomQueryTypes.id) {
                return document.getElementById(query.name);
            } else {
                return new DOM.DOMEnumerator<HTMLElement>(document.querySelectorAll(expr));
            }
        }
    }

    export enum DomQueryTypes {
        id = 1, class = 10, tagName = -100
    }

    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo): any {
            return From(expr);
        }
    }
}