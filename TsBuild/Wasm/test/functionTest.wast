(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/19/2019 10:55:38 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function print Lib "console" Alias "log" (info As char*) As i32
    (func $print (import "console" "log") (param $info i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 20 bytes in memory
    (data (i32.const 1) "Another string value\00")

    ;; String from 22 with 36 bytes in memory
    (data (i32.const 22) "This is the optional parameter value\00")
    
    

    ;; export from [functionTest]
    
    (export "calls" (func $calls))
    (export "Main" (func $Main))
    
     

    ;; functions in [functionTest]
    
    (func $calls  (result i32)
        ;; Public Function calls() As i32
        
    (call $Main (i32.const 1) (i32.const 999999))
    (call $Main (i32.const 22) (i32.const -100))
    (return (i32.const 0))
    )
    (func $Main (param $args i32) (param $obj i32) (result i32)
        ;; Public Function Main(args As char*, obj As i32) As i32
        
    (call $print (get_local $args))
    (return (i32.const 0))
    )
    )