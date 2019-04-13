namespace WebAssembly {

    export module Console {

        export function log(message: number) {
            console.log(ObjectManager.readText(message));
        }

        export function warn(message: number) {
            console.warn(ObjectManager.readText(message));
        }

        export function info(message: number) {
            console.info(ObjectManager.readText(message));
        }

        export function error(message: number) {
            console.error(ObjectManager.readText(message));
        }
    }
}