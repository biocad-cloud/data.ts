(module ;; Module EnumTest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/15/2019 11:52:34 PM

    ;; imports must occur before all non-import definitions

    
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    
    

    (export "Add1" (func $Add1)) 

    (func $Add1 (param $i i32) (result i64)
        ;; Public Function Add1(i As i32) As i64
        (local $x i32)
    (local $a i64)
    (set_local $x (i32.add (get_local $i) (i32.const 1)))
    (set_local $a (i64.extend_s/i32 (get_local $x)))
    (return (get_local $a))
    ))