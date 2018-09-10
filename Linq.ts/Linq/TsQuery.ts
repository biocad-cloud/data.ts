namespace Linq.TsQuery {

    export const handler = {
        string: () => new stringEval()
    };

    export interface IEval {
        doEval(expr: any, type: TypeInfo): any;
    }

    export class stringEval implements IEval {

        doEval(expr: any, type: TypeInfo): any {

        }
    }

    export class arrayEval implements IEval {

        doEval(expr: any, type: TypeInfo): any {

        }
    }
}