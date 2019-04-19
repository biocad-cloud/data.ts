(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/19/2019 8:11:38 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function print Lib "console" Alias "log" (info As char*) As i32
    (func $print (import "console" "log") (param $info i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 20 bytes in memory
    (data (i32.const 1) "Another string value\00")
    
    

    ;; export from [functionTest]
    
    (export "Main" (func $Main))
    (export "calls" (func $calls))
    
     

    ;; functions in [functionTest]
    
    (func $Main (param $args i32) 
        ;; Public Function Main(args As char*) As void
        
    (call $print (get_local $args))
    )
    (func $calls  (result i32)
        ;; Public Function calls() As i32
        
    (call $Main )
    (call $Main (i32.const 1))
    (return (i32.const 0))
    )
    )