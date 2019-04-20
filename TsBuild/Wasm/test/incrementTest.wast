(module ;; Module 

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/20/2019 9:50:54 PM

    ;; imports must occur before all non-import definitions

    
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    
    

    ;; export from [incrementTest]
    
    (export "runAdd" (func $runAdd))
    (export "show" (func $show))
    
     

    ;; functions in [incrementTest]
    
    (func $runAdd  (result f64)
        ;; Public Function runAdd() As f64
        (local $i i32)
    (local $x i32)
    (set_local $i (i32.const 999))
    (call $show (i32.add (i32.const 0) (i32.add (i32.const 0) (get_local $i))))
    (set_local $x (i32.add (i32.const 0) (i32.add (i32.const 0) (get_local $i))))
    (return (f64.convert_s/i32 (get_local $i)))
    )
    (func $show (param $x i32) (result i32)
        ;; Public Function show(x As i32) As i32
        
    (return (i32.const 0))
    )
    )