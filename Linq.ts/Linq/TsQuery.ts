namespace Linq.TsQuery {

    export const handler = {
        string: () => new stringEval(),
        array: () => new arrayEval()
    };

    export interface IEval<T> {
        doEval(expr: T, type: TypeInfo): any;
    }

    export class stringEval implements IEval<string> {

        doEval(expr: string, type: TypeInfo): any {
            return document.createElement("div");
        }
    }

    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo): any {
            return From(expr);
        }
    }
}