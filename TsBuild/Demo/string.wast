(module

  (memory $gg 1)  
  
  (data (i32.const 1) "\16")
  (data (i32.const 2) "\11")
  
  (data (i32.const 100) "Hello World")
  (data (i32.const 300) "[AAAAA]")  
  
  (export "memory" (memory $gg)) 
  
)