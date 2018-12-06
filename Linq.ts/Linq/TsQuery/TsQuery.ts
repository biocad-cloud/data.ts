import { DOMEnumerator } from "../DOM/DOMEnumerator";

namespace Linq.TsQuery {

    /**
     * 在这个字典之中的键名称主要有两大类型:
     * 
     * + typeof 类型判断结果
     * + TypeInfo.class 类型名称
    */
    export const handler = {
        /**
         * HTML document query handler
        */
        string: () => new stringEval(),
        /**
         * Create a linq object
        */
        array: () => new arrayEval(),
        NodeListOf: () => new DOMEnumeratorIEval(),
        HTMLCollection: () => new DOMEnumeratorIEval()
    };

    export interface IEval<T> {
        doEval(expr: T, type: TypeInfo, args: object): any;
    }

    /**
     * Create a Linq Enumerator
    */
    export class arrayEval<V> implements IEval<V[]> {

        doEval(expr: V[], type: TypeInfo, args: object): any {
            return From(expr);
        }
    }

    export class DOMEnumeratorIEval<V extends HTMLElement> implements IEval<NodeListOf<V>> {

        doEval(expr: NodeListOf<V>, type: TypeInfo, args: object): any {
            return new DOMEnumerator<V>(expr);
        }
    }
}