(module ;; Module Math

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/13/2019 7:09:17 PM

    ;; imports must occur before all non-import definitions

    ;; Declare Function Exp Lib "Math" Alias "exp" (x As f64) As f64
(func $Exp (import "Math" "exp") (param $x f64) (result f64))
    ;; Declare Function Random Lib "Math" Alias "random" () As f64
(func $Random (import "Math" "random")  (result f64))
    ;; Declare Function Display Lib "DOM" Alias "display" (x As f32) As i32
(func $Display (import "DOM" "display") (param $x f32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory $tmp00007 1)  

    ;; Memory data for string constant
    
;; -3 is the string length
(data (i32.const 1) "Hello world!")
    
    (global $global_i (mut i32) (i32.const 990))

    ;; Export memory block to Javascript 
    (export "memory" (memory $tmp00007)) 

    (export "HelloWorld" (func $HelloWorld))
    (export "PoissonPDF" (func $PoissonPDF))
    (export "Add10" (func $Add10))
    (export "GetGlobal" (func $GetGlobal))
    (export "FlipCoin" (func $FlipCoin))
    (export "HtmlTest" (func $HtmlTest)) 

    (func $HelloWorld  (result i32)
        ;; Public Function HelloWorld() As char*
        
    (return (i32.const 1))
    )
    
    (func $PoissonPDF (param $k i32) (param $lambda f64) (result f64)
        ;; Public Function PoissonPDF(k As i32, lambda As f64) As f64
        (local $result f64)
    (set_local $result (call $Exp (f64.sub (f64.const 0) (get_local $lambda))))
    ;; Start Do While Block block_9a020000
    
    (block $block_9a020000 
        (loop $loop_9b020000
    
                    (br_if $block_9a020000 (i32.eqz (i32.ge_s (get_local $k) (i32.const 1))))
            (set_local $result (f64.mul (get_local $result) (f64.div (get_local $lambda) (f64.convert_s/i32 (get_local $k)))))
            (set_local $k (i32.sub (get_local $k) (i32.const 1)))
            (br $loop_9b020000)
    
        )
    )
    ;; End Loop loop_9b020000
    (return (get_local $result))
    )
    
    (func $Add10 (param $x i32) (result i32)
        ;; Public Function Add10(x As i32) As i32
        (local $i i32)
    (set_local $i (i32.const 0))
    ;; For i As Integer = 0 To 9
    
    (block $block_9c020000 
        (loop $loop_9d020000
    
                    (br_if $block_9c020000 (i32.gt_s (get_local $i) (i32.const 9)))
            (set_local $i (i32.add (get_local $i) (i32.const 1)))
            (set_local $x (i32.add (get_local $x) (i32.const 1)))
            (br $loop_9d020000)
            ;; For Loop Next On loop_9d020000
    
        )
    )
    (set_global $global_i (i32.add (get_global $global_i) (i32.const 10)))
    (return (i32.add (get_local $x) (i32.mul (get_global $global_i) (i32.const 2))))
    )
    
    (func $GetGlobal  (result f32)
        ;; Public Function GetGlobal() As f32
        
    (return (f32.convert_s/i32 (get_global $global_i)))
    )
    
    (func $FlipCoin  (result f64)
        ;; Public Function FlipCoin() As f64
        (local $r f64)
    (set_local $r (call $Random ))
    
    (if (f64.ge (get_local $r) (f64.const 0.5)) 
        (then
                    (return (f64.add (f64.convert_s/i32 (i32.const 1)) (get_local $r)))
        )
        (else
                    (return (f64.sub (f64.convert_s/i32 (i32.sub (i32.const 0) (i32.const 1))) (get_local $r)))
        )
    )
    (return (f64.const 0))
    )
    
    (func $HtmlTest (param $x f32) (result f64)
        ;; Public Function HtmlTest(x As f32) As f64
        
    (call $Display (get_local $x))
    (return (f64.convert_s/i32 (call $Add10 (i32.trunc_s/f32 (get_local $x)))))
    )

    
(export "MemorySizeOf" (func $MemorySizeOf))

(func $MemorySizeOf (param $intPtr i32) (result i32)
    
    
(if (i32.eq (get_local $intPtr) (i32.const 1)) 
    (then
                (return (i32.const 12))
    )
    (else
        
    )
)

    ;; pointer not found
    (return (i32.const -1))
)


)