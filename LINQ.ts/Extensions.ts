/// <reference path="Linq/Enumerator.ts" />

function From<T>(source: T[]): IEnumerator<T> {
    return new IEnumerator<T>(source);
}

function IsNullOrEmpty<T>(array: T[]): boolean {
    if (array == null || array == undefined) {
        return true;
    } else if (array.length == 0) {
        return true;
    } else {
        return false;
    }
}