(module ;; Module boolTest

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/16/2019 12:01:44 AM

    ;; imports must occur before all non-import definitions

    ;; Declare Function Random Lib "Math" Alias "random" () As f64
    (func $Random (import "Math" "random")  (result f64))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    
    

    (export "logical" (func $logical)) 

    (func $logical  (result i32)
        ;; Public Function logical() As i32
        (local $b i32)
    (set_local $b (f64.ge (call $Random ) (f64.const 0.5)))
    
    (if (get_local $b) 
        (then
                    (return (i32.const 1))
        ) (else
                    (return (i32.sub (i32.const 0) (i32.const 100)))
        )
    )
    (return (i32.const 0))
    ))