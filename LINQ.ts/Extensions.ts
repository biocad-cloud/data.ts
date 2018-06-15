function From<T>(source: T[]): Enumerator<T> {
    return new Enumerator<T>(source);
}