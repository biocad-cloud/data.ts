(module ;; Module EnumTest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/16/2019 12:01:44 AM

    ;; imports must occur before all non-import definitions

    
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    
    

    (export "DoAdd" (func $DoAdd))
    (export "Add1" (func $Add1)) 

    (func $DoAdd  (result i32)
        ;; Public Function DoAdd() As i32
        
    (return (i32.wrap/i64 (call $Add1 (i32.wrap/i64 (i64.add (i64.add (i64.extend_s/i32 (i32.const 3)) (i64.const 4)) (i64.extend_s/i32 (i32.const 999)))))))
    )
    
    (func $Add1 (param $i i32) (result i64)
        ;; Public Function Add1(i As i32) As i64
        (local $x i32)
    (local $a i64)
    (set_local $x (i32.add (get_local $i) (i32.const 1)))
    (set_local $a (i64.extend_s/i32 (get_local $x)))
    (return (get_local $a))
    ))