function From<T>(source: T[]): IEnumerator<T> {
    return new IEnumerator<T>(source);
}