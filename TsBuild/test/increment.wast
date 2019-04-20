(module

(func $add (result i32)

 (local $a i32)
 (local $b i32)

(set_local $a (i32.const 10))

;; b = ++a
(set_local $b (set_local $a (i32.add (get_local $a) (i32.const 1))))

    (return (get_local $b))

)


)