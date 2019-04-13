(module

  (memory $gg 1)  
  
  (data (i32.const 100) "Hello World")
  (data (i32.const 300) "[AAAAA]")  
  
  (export "memory" (memory $gg)) 
  
  (func $HelloWorld  (result i32)
        ;; Public Function HelloWorld() As char*
		
    (i32.store (i32.const 99) (i32.const 0))
	   
    (return (i32.const 13))
  )
  
  
  (global $global_i (mut i32) (call $HelloWorld))
  
)