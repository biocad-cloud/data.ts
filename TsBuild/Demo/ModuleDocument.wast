(module ;; Module ModuleDocument

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/13/2019 8:15:43 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function DOMById Lib "document" Alias "getElementById" (id As char*) As i32
(func $DOMById (import "document" "getElementById") (param $id i32) (result i32))
    ;; Declare Function WriteText Lib "document" Alias "writeElementText" (dom As i32, text As char*) As i32
(func $WriteText (import "document" "writeElementText") (param $dom i32) (param $text i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory $Xf1010000 1)  

    ;; Memory data for string constant
    
;; String from 1 with 12 bytes in memory
(data (i32.const 1) "Hello world!")
    
    

    ;; Export memory block to Javascript 
    (export "memory" (memory $Xf1010000)) 

    (export "sayHello" (func $sayHello)) 

    (func $sayHello  (result i32)
        ;; Public Function sayHello() As char*
        (local $text i32)
    (local $node i32)
    (set_local $text (i32.const 1))
    (set_local $node (call $DOMById (get_local $text)))
    (call $WriteText (get_local $node) (get_local $text))
    (return (get_local $text))
    )

    
(export "MemorySizeOf" (func $MemorySizeOf))

(func $MemorySizeOf (param $intPtr i32) (result i32)
    
    
(if (i32.eq (get_local $intPtr) (i32.const 1)) 
    (then
                (return (i32.const 12))
    ) 
)

    ;; pointer not found
    (return (i32.const -1))
)


)