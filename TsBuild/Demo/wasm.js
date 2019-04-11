/** 
 * Run the compiled VisualBasic.NET assembly module
 * 
 * @param module The ``*.wasm`` module file path
 * @param run A action delegate for utilize the VB.NET assembly module
*/
function RunAssembly(module, run, imports) {
    fetch(module).then(function (response) {
            return response.arrayBuffer();
        })
        .then(function (buffer) {
            var dependencies = {
                "global": {},
                "env": {}
            };
            
			// imports javascript math by default
			dependencies["Math"] = window.Math;
			
			for (var itemName in imports) {
				dependencies[itemName] = imports[itemName];				
			}
			
            var moduleBufferView = new Uint8Array(buffer);
            return window.WebAssembly.instantiate(moduleBufferView, dependencies);
        }).then(wasm => {
            console.log(wasm);
            run(wasm);
        });
}