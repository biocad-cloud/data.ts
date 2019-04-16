(module ;; Module Stringstest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/16/2019 8:31:50 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function Print Lib "console" Alias "log" (text As char*) As i32
    (func $Print (import "console" "log") (param $text i32) (result i32))
    ;; Declare Function string.add Lib "string" Alias "add" (a As char*, b As char*) As char*
    (func $string.add (import "string" "add") (param $a i32) (param $b i32) (result i32))
    ;; Declare Function i32.toString Lib "string" Alias "toString" (s As i32) As char*
    (func $i32.toString (import "string" "toString") (param $s i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 1 bytes in memory
    (data (i32.const 1) " \00")

    ;; String from 3 with 4 bytes in memory
    (data (i32.const 3) "let \00")

    ;; String from 8 with 3 bytes in memory
    (data (i32.const 8) " + \00")

    ;; String from 12 with 3 bytes in memory
    (data (i32.const 12) " = \00")

    ;; String from 16 with 5 bytes in memory
    (data (i32.const 16) "Hello\00")

    ;; String from 22 with 5 bytes in memory
    (data (i32.const 22) "World\00")
    
    (global $a (mut i32) (i32.const 99))

(global $b (mut i32) (i32.const 100))

    (export "Main" (func $Main))
    (export "Hello" (func $Hello))
    (export "World" (func $World)) 

    (func $Main  (result i32)
        ;; Public Function Main() As char*
        (local $str i32)
    (local $format i32)
    (set_local $str (call $string.add (call $string.add (call $Hello ) (i32.const 1)) (call $World )))
    (set_local $format (call $string.add (call $string.add (call $string.add (call $string.add (call $string.add (i32.const 3) (call $i32.toString (get_global $a))) (i32.const 8)) (call $i32.toString (get_global $b))) (i32.const 12)) (call $i32.toString (i32.add (get_global $a) (get_global $b)))))
    (call $Print (get_local $str))
    (call $Print (get_local $format))
    (return (get_local $str))
    )
    
    (func $Hello  (result i32)
        ;; Public Function Hello() As char*
        
    (return (i32.const 16))
    )
    
    (func $World  (result i32)
        ;; Public Function World() As char*
        
    (return (i32.const 22))
    ))