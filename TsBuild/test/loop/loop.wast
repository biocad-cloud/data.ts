(module

(export "Iter" (func $iter))

(func $iter (param $n i32) (param $loops i32) (result i32)
	
	
		(loop 
		
				
			(set_local $n (i32.add (get_local $n) (i32.const 1)))
						
			(set_local $loops (i32.sub (get_local $loops) (i32.const 1)))
			
			(if (i32.eq (get_local $loops) (i32.const 0))
			
				(br 0)
									
			)
		)

		(return (get_local $n))
)
)