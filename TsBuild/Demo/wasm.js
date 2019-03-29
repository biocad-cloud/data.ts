/** 
 * Run the compiled VisualBasic.NET assembly module
 * 
 * @param module The ``*.wasm`` module file path
 * @param run A action delegate for utilize the VB.NET assembly module
*/
function RunAssembly(module, run) {
    fetch(module).then(function (response) {
            return response.arrayBuffer();
        })
        .then(function (buffer) {
            var dependencies = {
                "global": {},
                "env": {}
            };
            dependencies["Math"] = window.Math;
            var moduleBufferView = new Uint8Array(buffer);
            return WebAssembly.instantiate(moduleBufferView, dependencies);
        }).then(wasm => {
            console.log(wasm);
            run(wasm);
        });
}