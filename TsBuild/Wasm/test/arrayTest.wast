(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/20/2019 11:40:32 AM

    ;; imports must occur before all non-import definitions

    ;; Declare Function debug Lib "console" Alias "log" (any As System.String[]) As i32
    (func $debug (import "console" "log") (param $any i32) (result i32))
    ;; Declare Function print Lib "console" Alias "log" (any As char*) As i32
    (func $print (import "console" "log") (param $any i32) (result i32))
    ;; Declare Function new.array Lib "array" Alias "new" () As i32
    (func $new.array (import "array" "new")  (result i32))
    ;; Declare Function push.array Lib "array" Alias "push" (array As i32, element As i32) As i32
    (func $push.array (import "array" "push") (param $array i32) (param $element i32) (result i32))
    ;; Declare Function array.get Lib "array" Alias "get" (array As i32, index As i32) As i32
    (func $array.get (import "array" "get") (param $array i32) (param $index i32) (result i32))
    ;; Declare Function array.set Lib "array" Alias "set" (array As i32, index As i32, value As i32) As i32
    (func $array.set (import "array" "set") (param $array i32) (param $index i32) (param $value i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 6 bytes in memory
    (data (i32.const 1) "333333\00")

    ;; String from 8 with 5 bytes in memory
    (data (i32.const 8) "AAAAA\00")

    ;; String from 14 with 5 bytes in memory
    (data (i32.const 14) "XXXXX\00")

    ;; String from 20 with 6 bytes in memory
    (data (i32.const 20) "534535\00")

    ;; String from 27 with 13 bytes in memory
    (data (i32.const 27) "asdajkfsdhjkf\00")

    ;; String from 41 with 11 bytes in memory
    (data (i32.const 41) "Hello world\00")
    
    

    ;; export from [arrayTest]
    
    (export "createArray" (func $createArray))
    
     

    ;; functions in [arrayTest]
    
    (func $createArray  (result i32)
        ;; Public Function createArray() As i32
        (local $str i32)
    (local $strAtFirst i32)
    (set_local $str (call $push.array (call $push.array (call $push.array (call $push.array (call $push.array (call $new.array ) (i32.const 1)) (i32.const 8)) (i32.const 14)) (i32.const 20)) (i32.const 27)))
    (set_local $strAtFirst (call $array.get (get_local $str) (i32.const 0)))
    (call $debug (get_local $str))
    (call $print (call $array.get (get_local $str) (i32.const 3)))
    (call $array.set (get_local $str) (i32.const 4) (i32.const 41))
    (call $debug (get_local $str))
    (call $print (call $array.get (get_local $str) (i32.const 4)))
    (return (i32.const 0))
    )
    )