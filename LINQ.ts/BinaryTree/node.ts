class node<T,V> {

    public key: T;
    public value: V;
    public left: node<T,V>;
    public right: node<T,V>;

    constructor(key: T, left: node<T,V>=null, right: node<T,V>=null) {
        this.key = key;
        this.left = left;
        this.right = right;
    }
}

class binaryTree<T,V> {
    public root: node<T,V>;
    public compares: (a: T, b: T) => number;

    constructor(comparer: (a: T, b: T) => number) {
        this.compares = comparer;
    }

    public find(term: T):V {
        var np = this.root;
        var cmp = 0;

        while (np) {
            cmp = this.compares(term, np.key);

            if (cmp == 0) {
                return np.value;
            } else if (cmp < 0) {
                np = np.left;
            } else {
                np = np.right;
            }
        }

        // not exists
        return null;
    }
}