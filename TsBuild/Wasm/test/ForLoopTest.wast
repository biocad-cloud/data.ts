(module ;; Module ForLoopTest

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
    
    
    

    (export "forloop" (func $forloop)) 

    (func $forloop  (result f64)
        ;; Public Function forloop() As f64
        (local $x f64)
    (local $i i32)
    (set_local $x (f64.convert_s/i32 (i32.const 999)))
    (set_local $i (i32.const 0))
    ;; For i As Integer = 0 To 100 Step 2
    
    (block $block_9a020000 
        (loop $loop_9b020000
    
                    (br_if $block_9a020000 (i32.gt_s (get_local $i) (i32.const 100)))
            (set_local $i (i32.add (get_local $i) (i32.const 2)))
            (set_local $x (f64.add (get_local $x) (f64.const 0.01)))
            (br $loop_9b020000)
            ;; For Loop Next On loop_9b020000
    
        )
    )
    (return (get_local $x))
    ))