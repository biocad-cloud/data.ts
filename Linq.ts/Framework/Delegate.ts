namespace Delegate {

    export interface Sub {
        <T>(arg: T): void;
    }

    export interface Sub {
        <T1, T2>(arg1: T1, arg2: T2): void;
    }

    export interface Sub {
        <T1, T2, T3>(arg1: T1, arg2: T2, arg3: T3): void;
    }

    export interface Func {
        <V>(): V;
    }

    export interface Func {
        <T, V>(arg: T): V;
    }

    export interface Func {
        <T1, T2, V>(arg1: T1, arg2: T2): V;
    }

    export interface Func {
        <T1, T2, T3, V>(arg1: T1, arg2: T2, arg3: T3): V;
    }
}