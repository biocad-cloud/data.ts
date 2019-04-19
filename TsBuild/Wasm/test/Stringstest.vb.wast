(module ;; Module Stringstest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/15/2019 8:36:56 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function Print Lib "console" Alias "log" (text As char*) As i32
    (func $Print (import "console" "log") (param $text i32) (result i32))
    ;; Declare Function string.add Lib "string" Alias "add" (a As char*, b As char*) As char*
    (func $string.add (import "string" "add") (param $a i32) (param $b i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 1 bytes in memory
    (data (i32.const 1) " \00")

    ;; String from 3 with 5 bytes in memory
    (data (i32.const 3) "Hello\00")

    ;; String from 9 with 5 bytes in memory
    (data (i32.const 9) "World\00")
    
    

    (export "Main" (func $Main))
    (export "Hello" (func $Hello))
    (export "World" (func $World)) 

    (func $Main  (result i32)
        ;; Public Function Main() As char*
        (local $str i32)
    (set_local $str (call $string.add (call $string.add (call $Hello ) (i32.const 1)) (call $World )))
    (call $Print (get_local $str))
    (return (get_local $str))
    )
    
    (func $Hello  (result i32)
        ;; Public Function Hello() As char*
        
    (return (i32.const 3))
    )
    
    (func $World  (result i32)
        ;; Public Function World() As char*
        
    (return (i32.const 9))
    ))