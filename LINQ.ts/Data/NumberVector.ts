namespace TypeScript.Data {

    export function group(x: number[], offset: number) {
        const groups: Group<number, number>[] = [];

        for (let d of x) {
            let hit: boolean = false;

            for (let n of groups) {
                if (Math.abs(n.Key - d) <= offset) {
                    hit = true;
                    n.Group.push(d);

                    break;
                }
            }

            if (!hit) {
                groups.push(new Group(d, [d]));
            }
        }

        return groups;
    }

    /**
*
*	COMPUTE: quantile
*
*
*	DESCRIPTION:
*		- Computes a quantile for a numeric array.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/


    /**
    * FUNCTION: ascending( a, b )
    *	Comparator function used to sort values in ascending order.
    *
    * @private
    * @param {Number} a
    * @param {Number} b
    * @returns {Number} difference between `a` and `b`
    */
    function ascending(a, b) {
        return a - b;
    } // end FUNCTION ascending()


    // QUANTILE //

    /**
    * FUNCTION: quantile( arr, prob[, opts] )
    *	Computes a quantile for a numeric array.
    *
    * @private
    * @param {Array} arr - 1d array
    * @param {Number} prob - quantile prob [0,1]
    * @param {Object} [opts] - method options:
        `method`: method used to interpolate a quantile value
        `sorted`: boolean flag indicating if the input array is sorted
    * @returns {Number} quantile value
    */
    export function quantile(arr: number[], p: number, opts: { sorted: boolean, method: string } = { sorted: false, method: "na" }) {
        if (!Array.isArray(arr)) {
            throw new TypeError('quantile()::invalid input argument. First argument must be an array.');
        }
        if (typeof p !== 'number' || p !== p) {
            throw new TypeError('quantile()::invalid input argument. Quantile probability must be numeric.');
        }
        if (p < 0 || p > 1) {
            throw new TypeError('quantile()::invalid input argument. Quantile probability must be on the interval [0,1].');
        }

        var len = arr.length,
            id;

        if (!opts.sorted) {
            arr = arr.slice();
            arr.sort(ascending);
        }

        // Cases...

        // [0] 0th percentile is the minimum value...
        if (p === 0.0) {
            return arr[0];
        }
        // [1] 100th percentile is the maximum value...
        if (p === 1.0) {
            return arr[len - 1];
        }
        // Calculate the vector index marking the quantile:
        id = (len * p) - 1;

        // [2] Is the index an integer?
        if (id === Math.floor(id)) {
            // Value is the average between the value at id and id+1:
            return (arr[id] + arr[id + 1]) / 2.0;
        }
        // [3] Round up to the next index:
        id = Math.ceil(id);
        return arr[id];
    } // end FUNCTION quantile()
}