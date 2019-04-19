namespace WebAssembly {

    /**
     * Javascript debug console
    */
    export module Console {

        // 因为message可能是任意的JavaScript对象
        // 所以在这里不进行直接文本字符串的读取
        // 需要做一些额外的处理操作

        export function log(message: number) {
            console.log(Any(message));
        }

        export function warn(message: number) {
            console.warn(Any(message));
        }

        export function info(message: number) {
            console.info(Any(message));
        }

        export function error(message: number) {
            console.error(Any(message));
        }

        function Any(intPtr: number): any {
            if (intPtr < 0) {
                // 可能是一个指针，因为在这里指针都是小于零的
                if (ObjectManager.isNull(intPtr)) {
                    // 是一个负数
                    return intPtr;
                } else {
                    return ObjectManager.getObject(intPtr);
                }
            } else {
                // 如何处理正实数？
                return ObjectManager.readText(intPtr);
            }
        }
    }
}