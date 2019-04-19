(module

  (memory $gg 1)  
   
  (data (i32.const 100) "Hello World\00XXXXX")
  (data (i32.const 300) "[AAAAA]")  
  
  (export "memory" (memory $gg)) 
  
)