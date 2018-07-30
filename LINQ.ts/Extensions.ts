/// <reference path="Linq/Enumerator.ts" />

function From<T>(source: T[]): IEnumerator<T> {    
    return new IEnumerator<T>(source);
}

module DataExtensions {

    export function as_numeric(obj: any): number {
        if (typeof obj === 'number') {
            return <number>obj;
        } else if (typeof obj === 'boolean') {
            if (obj == true) {
                return 1;
            } else {
                return -1;
            }
        } else if (typeof obj == 'undefined') {
            return 0;
        } else {
            return 0;
        }
    }
}