(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/20/2019 10:28:13 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function print Lib "console" Alias "log" (info As char*) As i32
    (func $print (import "console" "log") (param $info i32) (result i32))
    ;; Declare Function err Lib "console" Alias "error" (message As System.Object) As void
    (func $err (import "console" "error") (param $message i32) )
    ;; Declare Function string_replace Lib "string" Alias "replace" (input As char*, find As i32, replacement As char*) As i32
    (func $string_replace (import "string" "replace") (param $input i32) (param $find i32) (param $replacement i32) (result i32))
    ;; Declare Function string_add Lib "string" Alias "add" (a As char*, b As char*) As char*
    (func $string_add (import "string" "add") (param $a i32) (param $b i32) (result i32))
    ;; Declare Function string_length Lib "string" Alias "length" (text As char*) As i32
    (func $string_length (import "string" "length") (param $text i32) (result i32))
    ;; Declare Function string_indexOf Lib "string" Alias "" (input As char*, find As char*) As i32
    (func $string_indexOf (import "string" "") (param $input i32) (param $find i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 12 bytes in memory
    (data (i32.const 1) "345566777777\00")

    ;; String from 14 with 20 bytes in memory
    (data (i32.const 14) "Another string value\00")

    ;; String from 35 with 36 bytes in memory
    (data (i32.const 35) "This is the optional parameter value\00")

    ;; String from 72 with 15 bytes in memory
    (data (i32.const 72) "this is message\00")
    
    

    ;; export from [functionTest]
    
    (export "extensionFunctiontest" (func $extensionFunctiontest))
    (export "calls" (func $calls))
    (export "Main" (func $Main))
    (export "outputError" (func $outputError))
    
     

    ;; functions in [functionTest]
    
    (func $extensionFunctiontest  
        ;; Public Function extensionFunctiontest() As void
        
    (drop (call $print (i32.const 1)))
    )
    (func $calls  
        ;; Public Function calls() As void
        
    (call $Main (i32.const 14) (i32.const 999999))
    (call $Main (i32.const 35) (i32.const -100))
    (drop (call $outputError ))
    )
    (func $Main (param $args i32) (param $obj i32) 
        ;; Public Function Main(args As char*, obj As i32) As void
        
    (drop (call $print (get_local $args)))
    (drop (call $print (get_local $obj)))
    )
    (func $outputError  (result f32)
        ;; Public Function outputError() As f32
        
    (call $err (i32.const 72))
    (return (f32.demote/f64 (f64.sub (f64.const 0) (f64.const 0.0001))))
    )
    )