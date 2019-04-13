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
var WebAssembly;
(function (WebAssembly) {
    var Document = /** @class */ (function () {
        function Document(bytes) {
            this.hashTable = {};
            this.streamReader = new TypeScript.stringReader(bytes);
        }
        Document.prototype.getElementById = function (id) {
            var idText = this.streamReader.readText(id);
            var node = window.document.getElementById(idText);
            return this.addObject(node);
        };
        Document.prototype.writeElementText = function (key, text) {
            var node = this.hashTable[key];
            var textVal = this.streamReader.readText(text);
            node.innerText = textVal;
        };
        Document.prototype.addObject = function (o) {
            var key = this.hashCode;
            this.hashTable[this.hashCode] = o;
            this.hashCode++;
            return key;
        };
        return Document;
    }());
    WebAssembly.Document = Document;
})(WebAssembly || (WebAssembly = {}));
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
        function RunAssembly(module, opts) {
            var byteBuffer = new window.WebAssembly.Memory({ initial: 10 });
            var dependencies = {
                "global": {},
                "env": {
                    bytechunks: byteBuffer
                }
            };
            var api = opts.api || { document: false };
            var host = new TypeScript.api(byteBuffer);
            // imports the javascript math module for VisualBasic.NET module by default
            dependencies["Math"] = window.Math;
            if (typeof opts.imports == "object") {
                for (var key in opts.imports) {
                    dependencies[key] = opts.imports[key];
                }
            }
            if (api.document) {
                dependencies["document"] = host.document;
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
                opts.run(wasm);
            });
        }
        Wasm.RunAssembly = RunAssembly;
    })(Wasm = TypeScript.Wasm || (TypeScript.Wasm = {}));
    var api = /** @class */ (function () {
        function api(bytechunks) {
            this.document = new WebAssembly.Document(bytechunks);
        }
        return api;
    }());
    TypeScript.api = api;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var memoryReader = /** @class */ (function () {
        function memoryReader(bytechunks) {
            this.buffer = bytechunks.buffer;
        }
        memoryReader.prototype.sizeOf = function (intPtr) {
            var buffer = new Uint8Array(this.buffer, intPtr);
            var size = buffer.findIndex(function (b) { return b == 0; });
            return size;
        };
        return memoryReader;
    }());
    TypeScript.memoryReader = memoryReader;
    var stringReader = /** @class */ (function (_super) {
        __extends(stringReader, _super);
        /**
         * @param memory The memory buffer
        */
        function stringReader(memory) {
            var _this = _super.call(this, memory) || this;
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