namespace WebAssembly.ObjectManager {

    /**
     * use prime number as hash code to avoid conflicts???
    */
    export module PrimeHashCode {

        const seed: number[] = [2, 3, 5, 7];

        function is_divisible_by(x: number, y: number): boolean {
            return !((x) % (y));
        }

        export function getNextPrime(n: number): number {
            for (let x: number = n; x < 100000; x++) {
                if (isPrime(x)) {
                    return x;
                }
            }
        }

        /**
         * 判断是否是质数
         * 
         * https://github.com/jselbie/isprime/blob/master/isprime.cpp
        */
        export function isPrime(n: number): boolean {
            // 总是确认数值不是负数,所以在这里移除掉这个判断
            /*
            if (n <= 1) {
                return false;
            }*/

            for (let i = 0; i < 4; i++) {
                if (seed[i] == n) {
                    return true;
                }
                if (is_divisible_by(n, seed[i])) {
                    return false;
                }
            }

            /* ============================================
                Using the table below as a reference, we can see that the pattern of divisibility by 3 or 5 repeats every 30 sequential values
                Any column with an "x" is already a value divisible by 3 or 5. So we can skip several sequences
                Net result is that only 26% of all sequential numbers get tested
                So instead of testing against every odd number, we can test against numbers that are not divisible by 2,3,or5
                      003,005,007,009,011,013,015,017,019,021,023,025,027,029,031,033,035,037,039,041,043,045,047,049,051,53,55,57
             +                  0       4   6      10  12      16          22  24         *30
             3          x           x           x           x           x           x           x           x           x
             5              x                   x                   x                   x                   x
               ============================================
            */

            // ASSERT: d should be in the seed table above, but chances are high that d > sqrt(n)
            let d = 7;
            let root = Sqrt(n);
            let result: boolean;

            // +1 to deal with rounding errors from computing the floored square root
            const stop = root + 1;

            while (d <= stop) {
                result = is_divisible_by(n, d) ||
                    is_divisible_by(n, d + 4) ||
                    is_divisible_by(n, d + 6) ||
                    is_divisible_by(n, d + 10) ||
                    is_divisible_by(n, d + 12) ||
                    is_divisible_by(n, d + 16) ||
                    is_divisible_by(n, d + 22) ||
                    is_divisible_by(n, d + 24);

                if (result) {
                    return false;
                } else {
                    d += 30;
                }
            }

            return true;
        }

        const SQRT_CAP = 1 << 53;
        const TWO_POW_32 = 1 << 32;

        function Sqrt(val: number): number {
            // if type is unsigned this will be ignored = no runtime  
            if (val < 0) {
                // negative number ERROR  
                return 0;
            }

            // We really want to use sqrt whenever possible. It gets performed in hardware on most platforms and is much, much faster than the loop below.
            // But... anything bigger than 2**53 will have some issues inside a double. http://stackoverflow.com/questions/1848700/biggest-integer-that-can-be-stored-in-a-double
            // So we can only use sqrt reliably when val is less than or equal 2**53

            if (val <= SQRT_CAP) {
                return Math.sqrt(val);
            }

            // return an approximate square root that is greather than or equal to the actual square root
            // any 64 bit number, N,  can be expressed in terms of x and y as

            // Therefore sqrt(N) = sqrt(x) * sqrt(2^32) + , where z is some value to account for the "y" portion of the equation
            // but we know that (x+1)<< 32 is always greater than (x<<32)|y, thus we can live with just getting sqrt(x+1) and multiplying the result by 2^16
            // that will return a slightly greater sqrt, but for computing the stop point below, it will suffice
            let uval = val;
            let shift = 0;

            while (uval >= TWO_POW_32) {
                uval = uval >> 32;
                shift += 32;
            }

            let d2 = Math.sqrt((uval + 1));
            let result = Math.ceil(d2);

            result = result << (shift / 2);

            return result;
        }
    }
}