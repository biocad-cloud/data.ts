namespace Linq.TsQuery {

    export const handler = {
        string: () => new stringEval()
    };

    export interface IEval {
        doEval(expr: any): any;
    }

    export class stringEval implements IEval {

        doEval(expr: any): any {

        }
    }
}