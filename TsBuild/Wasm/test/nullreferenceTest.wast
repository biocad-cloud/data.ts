(module ;; Module nullreferenceTest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/17/2019 8:10:33 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function DOMbyId Lib "document" Alias "getElementById" (id As char*) As i32
    (func $DOMbyId (import "document" "getElementById") (param $id i32) (result i32))
    ;; Declare Function setAttr Lib "document" Alias "setAttribute" (node As i32, name As char*, value As char*) As i32
    (func $setAttr (import "document" "setAttribute") (param $node i32) (param $name i32) (param $value i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 4 bytes in memory
    (data (i32.const 1) "test\00")

    ;; String from 6 with 1 bytes in memory
    (data (i32.const 6) "a\00")

    ;; String from 8 with 1 bytes in memory
    (data (i32.const 8) "b\00")

    ;; String from 10 with 1 bytes in memory
    (data (i32.const 10) "a\00")

    ;; String from 12 with 1 bytes in memory
    (data (i32.const 12) "b\00")
    
    

    (export "test" (func $test)) 

    (func $test  (result i32)
        ;; Public Function test() As i32
        (local $node i32)
    (set_local $node (call $DOMbyId (i32.const 1)))
    (call $setAttr (get_local $node) (i32.const 6) (i32.const 8))
    (call $setAttr (i32.const 0) (i32.const 10) (i32.const 12))
    (return (i32.const 0))
    ))