function RunAssembly(module, run) {
    fetch(module).then(function (response) {
            return response.arrayBuffer();
        })
        .then(function (buffer) {
            var dependencies = {
                "global": {},
                "env": {}
            };
            dependencies["global.Math"] = window.Math;
            var moduleBufferView = new Uint8Array(buffer);
            return WebAssembly.instantiate(moduleBufferView, dependencies);
        }).then(wasm => {
            console.log(wasm);
            run(wasm);
        });
}