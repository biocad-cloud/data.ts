var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../build/linq.d.ts" />
var TypeScript;
(function (TypeScript) {
    /**
     * The web assembly helper
    */
    var Wasm;
    (function (Wasm) {
        /**
         * The webassembly engine.
        */
        var engine = window.WebAssembly;
        /**
         * Run the compiled VisualBasic.NET assembly module
         *
         * > This function add javascript ``math`` module as imports object automatic
         *
         * @param module The ``*.wasm`` module file path
         * @param run A action delegate for utilize the VB.NET assembly module
         *
        */
        function RunAssembly(module, run, imports) {
            if (imports === void 0) { imports = null; }
            var dependencies = {
                "global": {},
                "env": {}
            };
            // imports the javascript math module for VisualBasic.NET module by default
            dependencies["Math"] = window.Math;
            if (typeof imports == "object") {
                for (var key in imports) {
                    dependencies[key] = imports[key];
                }
            }
            fetch(module)
                .then(function (response) {
                if (response.ok) {
                    return response.arrayBuffer();
                }
                else {
                    throw "Unable to fetch Web Assembly file " + module + ".";
                }
            })
                .then(function (buffer) { return new Uint8Array(buffer); })
                .then(function (module) {
                return engine.instantiate(module, dependencies);
            }).then(function (wasm) {
                if (typeof TypeScript.logging == "object" && TypeScript.logging.outputEverything) {
                    console.log("Load external WebAssembly module success!");
                    console.log(wasm);
                }
                run(wasm);
            });
        }
        Wasm.RunAssembly = RunAssembly;
    })(Wasm = TypeScript.Wasm || (TypeScript.Wasm = {}));
    var memoryReader = /** @class */ (function () {
        function memoryReader(wasm) {
            this.sizeOf = wasm.instance.exports.MemorySizeOf;
            this.buffer = wasm.instance.exports.memory.buffer;
        }
        return memoryReader;
    }());
    TypeScript.memoryReader = memoryReader;
    var stringReader = /** @class */ (function (_super) {
        __extends(stringReader, _super);
        /**
         * @param memory The memory buffer
        */
        function stringReader(wasm) {
            var _this = _super.call(this, wasm) || this;
            _this.decoder = new TextDecoder();
            return _this;
        }
        /**
         * Read text from WebAssembly memory buffer.
        */
        stringReader.prototype.readTextRaw = function (offset, length) {
            var str = new Uint8Array(this.buffer, offset, length);
            var text = this.decoder.decode(str);
            return text;
        };
        stringReader.prototype.readText = function (intPtr) {
            return this.readTextRaw(intPtr, this.sizeOf(intPtr));
        };
        return stringReader;
    }(memoryReader));
    TypeScript.stringReader = stringReader;
})(TypeScript || (TypeScript = {}));
//# sourceMappingURL=visualbasic.wasm.js.map