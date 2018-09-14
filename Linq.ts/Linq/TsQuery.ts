namespace Linq.TsQuery {

    export const handler = {
        /**
         * HTML document query handler
        */
        string: () => new stringEval(),
        /**
         * Create a linq object
        */
        array: () => new arrayEval()
    };

    export interface IEval<T> {
        doEval(expr: T, type: TypeInfo): any;
    }



    export class stringEval implements IEval<string> {

        doEval(expr: string, type: TypeInfo): any {
            var query: DOMQuery = DOMQuery.parseQuery(expr);

            if (query.type == DomQueryTypes.id) {
                return document.getElementById(query.expression);
            } else if (query.type == DomQueryTypes.NoQuery) {


                return new DOM.DOMEnumerator<HTMLElement>(document.querySelectorAll(expr));
            }
        }
    }



    /**
     * Create a Linq Enumerator
    */
    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo): any {
            return From(expr);
        }
    }
}