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
    var XMLHttpRequest;
    (function (XMLHttpRequest) {
        function get(url) {
            throw "not implement!";
        }
        XMLHttpRequest.get = get;
    })(XMLHttpRequest = WebAssembly.XMLHttpRequest || (WebAssembly.XMLHttpRequest = {}));
})(WebAssembly || (WebAssembly = {}));
var WebAssembly;
(function (WebAssembly) {
    var Console;
    (function (Console) {
        function log(message) {
            console.log(WebAssembly.ObjectManager.readText(message));
        }
        Console.log = log;
        function warn(message) {
            console.warn(WebAssembly.ObjectManager.readText(message));
        }
        Console.warn = warn;
        function info(message) {
            console.info(WebAssembly.ObjectManager.readText(message));
        }
        Console.info = info;
        function error(message) {
            console.error(WebAssembly.ObjectManager.readText(message));
        }
        Console.error = error;
    })(Console = WebAssembly.Console || (WebAssembly.Console = {}));
})(WebAssembly || (WebAssembly = {}));
var WebAssembly;
(function (WebAssembly) {
    var Document;
    (function (Document) {
        function getElementById(id) {
            var idText = WebAssembly.ObjectManager.readText(id);
            var node = document.getElementById(idText);
            return WebAssembly.ObjectManager.addObject(node);
        }
        Document.getElementById = getElementById;
        function writeElementText(nodeObj, text) {
            var node = WebAssembly.ObjectManager.getObject(nodeObj);
            var textVal = WebAssembly.ObjectManager.readText(text);
            node.innerText = textVal;
        }
        Document.writeElementText = writeElementText;
        function writeElementHtml(node, text) {
            var nodeObj = WebAssembly.ObjectManager.getObject(node);
            var htmlVal = WebAssembly.ObjectManager.readText(text);
            nodeObj.innerHTML = htmlVal;
        }
        Document.writeElementHtml = writeElementHtml;
        function createElement(tag) {
            var tagName = WebAssembly.ObjectManager.readText(tag);
            var node = document.createElement(tagName);
            return WebAssembly.ObjectManager.addObject(node);
        }
        Document.createElement = createElement;
        ;
        function setAttribute(node, attr, value) {
            var nodeObj = WebAssembly.ObjectManager.getObject(node);
            var name = WebAssembly.ObjectManager.readText(attr);
            var attrVal = WebAssembly.ObjectManager.readText(value);
            nodeObj.setAttribute(name, attrVal);
        }
        Document.setAttribute = setAttribute;
        function appendChild(parent, node) {
            var parentObj = WebAssembly.ObjectManager.getObject(parent);
            var child = WebAssembly.ObjectManager.getObject(node);
            parentObj.appendChild(child);
        }
        Document.appendChild = appendChild;
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
        function createBytes(opts) {
            var page = opts.page || { init: 10, max: 2048 };
            return new window.WebAssembly.Memory({ initial: page.init });
        }
        function ExecuteInternal(module, opts) {
            var byteBuffer = createBytes(opts);
            var dependencies = {
                "global": {},
                "env": {
                    bytechunks: byteBuffer
                }
            };
            // read/write webassembly memory
            WebAssembly.ObjectManager.load(byteBuffer);
            // add javascript api dependencies imports
            handleApiDependencies(dependencies, opts);
            var assembly = engine.instantiate(module, dependencies);
            return assembly;
        }
        function handleApiDependencies(dependencies, opts) {
            var api = opts.api || { document: false, console: true, http: true };
            // imports the javascript math module for VisualBasic.NET module by default
            dependencies["Math"] = window.Math;
            if (typeof opts.imports == "object") {
                for (var key in opts.imports) {
                    dependencies[key] = opts.imports[key];
                }
            }
            if (api.document) {
                dependencies["document"] = WebAssembly.Document;
            }
            if (api.console) {
                dependencies["console"] = WebAssembly.Console;
            }
            if (api.http) {
                dependencies["XMLHttpRequest"] = WebAssembly.XMLHttpRequest;
            }
            return dependencies;
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