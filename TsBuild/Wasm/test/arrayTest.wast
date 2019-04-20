(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/20/2019 11:01:07 AM

    ;; imports must occur before all non-import definitions

    ;; Declare Function debug Lib "console" Alias "log" (any As System.String[]) As i32
    (func $debug (import "console" "log") (param $any i32) (result i32))
    
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
    
    

    ;; export from [arrayTest]
    
    (export "createArray" (func $createArray))
    
     

    ;; functions in [arrayTest]
    
    (func $createArray  (result i32)
        ;; Public Function createArray() As i32
        (local $str i32)
    (set_local $str (call $push.array (call $push.array (call $push.array (call $push.array (call $push.array (call $new.array ) (i32.const 1)) (i32.const 8)) (i32.const 14)) (i32.const 20)) (i32.const 27)))
    (call $debug (get_local $str))
    (return (i32.const 0))
    )
    )