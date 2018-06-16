class node<T, V> {

    public key: T;
    public value: V;
    public left: node<T, V>;
    public right: node<T, V>;

    constructor(key: T, value: V = null,left: node<T, V> = null, right: node<T, V> = null) {
        this.key = key;
        this.left = left;
        this.right = right;
    }
}

class binaryTree<T, V> {
    
    public root: node<T, V>;
    public compares: (a: T, b: T) => number;

    constructor(comparer: (a: T, b: T) => number) {
        this.compares = comparer;
    }

    public add(term: T, value: V = null) {
        var np : node<T,V>= this.root;
        var cmp: number = 0;

        while (np) {
            cmp = this.compares(term, np.key);

            if (cmp == 0) {
                // this node is existed
                // value replace??
                np.value = value;
                break;
            } else if (cmp < 0) {
                if (np.left) {
                    np = np.left;
                } else {
                    // np is a leaf node?
                    // add at here
                    np.left = new node<T, V>(term, value);
                    break;
                }                
            } else {
                if (np.right) {
                    np = np.right;
                } else {
                    np.right = new node<T, V>(term, value);
                    break;
                }                
            }
        }
    }

    public find(term: T): V {
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