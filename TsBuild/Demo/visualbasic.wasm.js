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
    var ObjectManager;
    (function (ObjectManager) {
        var streamReader;
        var hashCode = 0;
        var hashTable = {};
        function load(bytes) {
            streamReader = new TypeScript.stringReader(bytes);
        }
        ObjectManager.load = load;
        function readText(intptr) {
            return streamReader.readText(intptr);
        }
        ObjectManager.readText = readText;
        function getObject(key) {
            return hashTable[key];
        }
        ObjectManager.getObject = getObject;
        function addObject(o) {
            var key = hashCode;
            hashTable[hashCode] = o;
            hashCode++;
            return key;
        }
        ObjectManager.addObject = addObject;
    })(ObjectManager = WebAssembly.ObjectManager || (WebAssembly.ObjectManager = {}));
})(WebAssembly || (WebAssembly = {}));
var WebAssembly;
(function (WebAssembly) {
    var Document;
    (function (Document) {
        function getElementById(id) {
            var idText = WebAssembly.ObjectManager.readText(id);
            var node = window.document.getElementById(idText);
            return WebAssembly.ObjectManager.addObject(node);
        }
        Document.getElementById = getElementById;
        function writeElementText(key, text) {
            var node = WebAssembly.ObjectManager.getObject(key);
            var textVal = WebAssembly.ObjectManager.readText(text);
            node.innerText = textVal;
        }
        Document.writeElementText = writeElementText;
    })(Document = WebAssembly.Document || (WebAssembly.Document = {}));
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
                .then(function (module) { return ExecuteInternal(module, opts); })
                .then(function (assembly) {
                if (typeof TypeScript.logging == "object" && TypeScript.logging.outputEverything) {
                    console.log("Load external WebAssembly module success!");
                    console.log(assembly);
                }
                opts.run(assembly);
            });
        }
        Wasm.RunAssembly = RunAssembly;
        function ExecuteInternal(module, opts) {
            var byteBuffer = new window.WebAssembly.Memory({ initial: 10 });
            var dependencies = {
                "global": {},
                "env": {
                    bytechunks: byteBuffer
                }
            };
            var api = opts.api || { document: false };
            // imports the javascript math module for VisualBasic.NET module by default
            dependencies["Math"] = window.Math;
            if (typeof opts.imports == "object") {
                for (var key in opts.imports) {
                    dependencies[key] = opts.imports[key];
                }
            }
            WebAssembly.ObjectManager.load(byteBuffer);
            if (api.document) {
                dependencies["document"] = WebAssembly.Document;
            }
            var assembly = engine.instantiate(module, dependencies);
            return assembly;
        }
    })(Wasm = TypeScript.Wasm || (TypeScript.Wasm = {}));
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