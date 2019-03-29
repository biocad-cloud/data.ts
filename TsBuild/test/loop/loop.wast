(module

(export "Iter" (func $iter))

(func $iter (param $n i32) (param $loops i32) (result i32)
	
	(block $doadd_break
		(loop $doadd
		
				
			(set_local $n (i32.add (get_local $n) (i32.const 2)))
						
			(set_local $loops (i32.sub (get_local $loops) (i32.const 1)))
			
			(br_if $doadd_break (i32.eq (get_local $loops) (i32.const 0)))
			(br $doadd)

			
		)

		)

		(return (get_local $n))
)
)