(module ;; Module nullreferenceTest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/17/2019 9:52:44 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function DOMbyId Lib "document" Alias "getElementById" (id As char*) As i32
    (func $DOMbyId (import "document" "getElementById") (param $id i32) (result i32))
    ;; Declare Function setAttr Lib "document" Alias "setAttribute" (node As i32, name As char*, value As char*) As i32
    (func $setAttr (import "document" "setAttribute") (param $node i32) (param $name i32) (param $value i32) (result i32))
    ;; Declare Function print Lib "console" Alias "log" (message As char*) As i32
    (func $print (import "console" "log") (param $message i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 7 bytes in memory
    (data (i32.const 1) "Nothing\00")

    ;; String from 9 with 4 bytes in memory
    (data (i32.const 9) "test\00")

    ;; String from 14 with 1 bytes in memory
    (data (i32.const 14) "a\00")

    ;; String from 16 with 1 bytes in memory
    (data (i32.const 16) "b\00")

    ;; String from 18 with 1 bytes in memory
    (data (i32.const 18) "a\00")

    ;; String from 20 with 1 bytes in memory
    (data (i32.const 20) "b\00")
    
    

    (export "noReturns" (func $noReturns))
    (export "test" (func $test)) 

    (func $noReturns  
        ;; Public Function noReturns() As void
        
    (call $print (i32.const 1))
    (call $print (i32.const 0))
    )
    
    (func $test  (result i32)
        ;; Public Function test() As i32
        (local $node i32)
    (set_local $node (call $DOMbyId (i32.const 9)))
    (call $setAttr (get_local $node) (i32.const 14) (i32.const 16))
    (call $setAttr (i32.const 0) (i32.const 18) (i32.const 20))
    (return (i32.const 0))
    ))