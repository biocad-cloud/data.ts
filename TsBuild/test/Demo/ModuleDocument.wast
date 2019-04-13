(module ;; Module ModuleDocument

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/13/2019 11:16:58 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function DOMById Lib "document" Alias "getElementById" (id As char*) As i32
(func $DOMById (import "document" "getElementById") (param $id i32) (result i32))
    ;; Declare Function WriteText Lib "document" Alias "writeElementText" (dom As i32, text As char*) As i32
(func $WriteText (import "document" "writeElementText") (param $dom i32) (param $text i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
;; String from 1 with 12 bytes in memory
(data (i32.const 1) "Hello world!\00")

;; String from 14 with 4 bytes in memory
(data (i32.const 14) "text\00")
    
    

    (export "sayHello" (func $sayHello)) 

    (func $sayHello  (result i32)
        ;; Public Function sayHello() As char*
        (local $text i32)
    (local $node i32)
    (set_local $text (i32.const 1))
    (set_local $node (call $DOMById (i32.const 14)))
    (call $WriteText (get_local $node) (get_local $text))
    (return (get_local $text))
    ))