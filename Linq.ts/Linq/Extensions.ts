namespace Linq {

    export function EnsureCollection<T>(data: T | T[] | IEnumerator<T>): IEnumerator<T> {
        var type = TypeInfo.typeof(data);

        if (type.IsEnumerator) {
            return <IEnumerator<T>>data;
        } else if (type.IsArray) {
            return new IEnumerator<T>(<T[]>data);
        } else {
            return new IEnumerator<T>([<T>data]);
        }
    }

    export function EnsureArray<T>(data: T | T[] | IEnumerator<T>): T[] {
        var type = TypeInfo.typeof(data);

        if (type.IsEnumerator) {
            return (<IEnumerator<T>>data).ToArray();
        } else if (type.IsArray) {
            return <T[]>data;
        } else {
            return [<T>data];
        }
    }
}