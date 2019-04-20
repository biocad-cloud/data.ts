(module ;; Module base64

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/21/2019 1:45:13 AM

    ;; imports must occur before all non-import definitions

    ;; Declare Function isNaN Lib "Math" Alias "isNaN" (x As i32) As boolean
    (func $isNaN (import "Math" "isNaN") (param $x i32) (result i32))
    ;; Declare Function print Lib "console" Alias "log" (obj As System.Object) As void
    (func $print (import "console" "log") (param $obj i32) )
    ;; Declare Function string_replace Lib "string" Alias "replace" (input As char*, find As i32, replacement As char*) As i32
    (func $string_replace (import "string" "replace") (param $input i32) (param $find i32) (param $replacement i32) (result i32))
    ;; Declare Function string_add Lib "string" Alias "add" (a As char*, b As char*) As char*
    (func $string_add (import "string" "add") (param $a i32) (param $b i32) (result i32))
    ;; Declare Function string_length Lib "string" Alias "length" (text As char*) As i32
    (func $string_length (import "string" "length") (param $text i32) (result i32))
    ;; Declare Function string_indexOf Lib "string" Alias "indexOf" (input As char*, find As char*) As i32
    (func $string_indexOf (import "string" "indexOf") (param $input i32) (param $find i32) (result i32))
    ;; Declare Function regexp Lib "RegExp" Alias "regexp" (pattern As char*, flag As char*) As i32
    (func $regexp (import "RegExp" "regexp") (param $pattern i32) (param $flag i32) (result i32))
    ;; Declare Function fromCharCode Lib "string" Alias "fromCharCode" (c As i32) As char
    (func $fromCharCode (import "string" "fromCharCode") (param $c i32) (result i32))
    ;; Declare Function charCodeAt Lib "string" Alias "charCodeAt" (text As char*, index As i32) As i32
    (func $charCodeAt (import "string" "charCodeAt") (param $text i32) (param $index i32) (result i32))
    ;; Declare Function charAt Lib "string" Alias "charAt" (text As char*, index As i32) As char*
    (func $charAt (import "string" "charAt") (param $text i32) (param $index i32) (result i32))
    ;; Declare Function Join Lib "string" Alias "join" (array As System.Array, delimiter As char*) As char*
    (func $Join (import "string" "join") (param $array i32) (param $delimiter i32) (result i32))
    ;; Declare Function new_array Lib "Array" Alias "create" () As i32
    (func $new_array (import "Array" "create")  (result i32))
    ;; Declare Function array_push Lib "Array" Alias "push" (array As i32, element As object) As i32
    (func $array_push (import "Array" "push") (param $array i32) (param $element i32) (result i32))
    ;; Declare Function array_get Lib "Array" Alias "get" (array As i32, index As i32) As i32
    (func $array_get (import "Array" "get") (param $array i32) (param $index i32) (result i32))
    ;; Declare Function array_length Lib "Array" Alias "length" (array As i32) As i32
    (func $array_length (import "Array" "length") (param $array i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
    ;; String from 1 with 65 bytes in memory
    (data (i32.const 1) "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\00")

    ;; String from 67 with 0 bytes in memory
    (data (i32.const 67) "\00")

    ;; String from 68 with 0 bytes in memory
    (data (i32.const 68) "\00")

    ;; String from 69 with 15 bytes in memory
    (data (i32.const 69) "[^A-Za-z0-9+/=]\00")

    ;; String from 85 with 1 bytes in memory
    (data (i32.const 85) "g\00")

    ;; String from 87 with 0 bytes in memory
    (data (i32.const 87) "\00")

    ;; String from 88 with 2 bytes in memory
    (data (i32.const 88) "rn\00")

    ;; String from 91 with 1 bytes in memory
    (data (i32.const 91) "g\00")

    ;; String from 93 with 1 bytes in memory
    (data (i32.const 93) "n\00")

    ;; String from 95 with 0 bytes in memory
    (data (i32.const 95) "\00")

    ;; String from 96 with 0 bytes in memory
    (data (i32.const 96) "\00")

    ;; String from 97 with 14 bytes in memory
    (data (i32.const 97) "base64 Encoder\00")

    ;; String from 112 with 53 bytes in memory
    (data (i32.const 112) "base64 Encoder written in VisualBasic.NET WebAssembly\00")

    ;; String from 166 with 3 bytes in memory
    (data (i32.const 166) "MIT\00")

    ;; String from 170 with 6 bytes in memory
    (data (i32.const 170) "base64\00")

    ;; String from 177 with 32 bytes in memory
    (data (i32.const 177) "Copyright © I@xieguigang.me 2019\00")

    ;; String from 210 with 19 bytes in memory
    (data (i32.const 210) "VisualBasic.wasm.js\00")

    ;; String from 230 with 36 bytes in memory
    (data (i32.const 230) "e9ba6299-1032-42ab-a760-25f246506c5b\00")

    ;; String from 267 with 12 bytes in memory
    (data (i32.const 267) "2.0.344.4444\00")

    ;; String from 280 with 10 bytes in memory
    (data (i32.const 280) "1.12.0.235\00")
    
    (global $keyStr (mut i32) (i32.const 1))

    ;; export from [base64Encoder]
    
    (export "encode" (func $encode))
    (export "decode" (func $decode))
    (export "utf8_encode" (func $utf8_encode))
    (export "utf8_decode" (func $utf8_decode))
    
    
    ;; export from [AssemblyInfo]
    
    (export "AssemblyTitle" (func $AssemblyTitle))
    (export "AssemblyDescription" (func $AssemblyDescription))
    (export "AssemblyCompany" (func $AssemblyCompany))
    (export "AssemblyProduct" (func $AssemblyProduct))
    (export "AssemblyCopyright" (func $AssemblyCopyright))
    (export "AssemblyTrademark" (func $AssemblyTrademark))
    (export "Guid" (func $Guid))
    (export "AssemblyVersion" (func $AssemblyVersion))
    (export "AssemblyFileVersion" (func $AssemblyFileVersion))
    
     

    ;; functions in [base64Encoder]
    
    (func $encode (param $text i32) (result i32)
        ;; Public Function encode(text As char*) As char*
        (local $base64 i32)
    (local $n i32)
    (local $r i32)
    (local $i i32)
    (local $s i32)
    (local $o i32)
    (local $u i32)
    (local $a i32)
    (local $f i32)
    (set_local $base64 (call $new_array ))
    (set_local $f (i32.const 0))
    (set_local $text (call $utf8_encode (get_local $text)))
    ;; Do While (f < text.Length)
    ;; Start Do While Block block_9a020000
    
    (block $block_9a020000 
        (loop $loop_9b020000
    
                    (br_if $block_9a020000 (i32.eqz (i32.lt_s (get_local $f) (call $string_length (get_local $text)))))
            (set_local $n (call $charCodeAt (get_local $text) (get_local $f)))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $r (call $charCodeAt (get_local $text) (get_local $f)))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $i (call $charCodeAt (get_local $text) (get_local $f)))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $s (i32.shr_s (get_local $n) (i32.const 2)))
            (set_local $o (i32.or (i32.shl (i32.and (get_local $n) (i32.const 3)) (i32.const 4)) (i32.shr_s (get_local $r) (i32.const 4))))
            (set_local $u (i32.or (i32.shl (i32.and (get_local $r) (i32.const 15)) (i32.const 2)) (i32.shr_s (get_local $i) (i32.const 6))))
            (set_local $a (i32.and (get_local $i) (i32.const 63)))
            
    (if (call $isNaN (get_local $r)) 
        (then
                    (set_local $a (i32.const 64))
            (set_local $u (get_local $a))
        ) 
    )
            (drop (call $array_push (get_local $base64) (call $charAt (get_global $keyStr) (get_local $s))))
            (drop (call $array_push (get_local $base64) (call $charAt (get_global $keyStr) (get_local $o))))
            (drop (call $array_push (get_local $base64) (call $charAt (get_global $keyStr) (get_local $u))))
            (drop (call $array_push (get_local $base64) (call $charAt (get_global $keyStr) (get_local $a))))
            (br $loop_9b020000)
    
        )
    )
    ;; End Loop loop_9b020000
    (return (call $Join (get_local $base64) (i32.const 67)))
    )
    (func $decode (param $base64 i32) (result i32)
        ;; Public Function decode(base64 As char*) As char*
        (local $text i32)
    (local $n i32)
    (local $r i32)
    (local $i i32)
    (local $s i32)
    (local $o i32)
    (local $u i32)
    (local $a i32)
    (local $f i32)
    (local $symbolsNotallowed i32)
    (set_local $text (i32.const 68))
    (set_local $f (i32.const 0))
    (set_local $symbolsNotallowed (call $regexp (i32.const 69) (i32.const 85)))
    (set_local $base64 (call $string_replace (get_local $base64) (get_local $symbolsNotallowed) (i32.const 87)))
    ;; Do While (f < base64.Length)
    ;; Start Do While Block block_9c020000
    
    (block $block_9c020000 
        (loop $loop_9d020000
    
                    (br_if $block_9c020000 (i32.eqz (i32.lt_s (get_local $f) (call $string_length (get_local $base64)))))
            (set_local $s (call $string_indexOf (get_global $keyStr) (call $charAt (get_local $base64) (get_local $f))))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $o (call $string_indexOf (get_global $keyStr) (call $charAt (get_local $base64) (get_local $f))))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $u (call $string_indexOf (get_global $keyStr) (call $charAt (get_local $base64) (get_local $f))))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $a (call $string_indexOf (get_global $keyStr) (call $charAt (get_local $base64) (get_local $f))))
            (set_local $f (i32.add (get_local $f) (i32.const 1)))
            (set_local $n (i32.or (i32.shl (get_local $s) (i32.const 2)) (i32.shr_s (get_local $o) (i32.const 4))))
            (set_local $r (i32.or (i32.shl (i32.and (get_local $o) (i32.const 15)) (i32.const 4)) (i32.shr_s (get_local $u) (i32.const 2))))
            (set_local $i (i32.or (i32.shl (i32.and (get_local $u) (i32.const 3)) (i32.const 6)) (get_local $a)))
            (set_local $text (call $string_add (get_local $text) (call $fromCharCode (get_local $n))))
            
    (if (i32.ne (get_local $u) (i32.const 64)) 
        (then
                    (set_local $text (call $string_add (get_local $text) (call $fromCharCode (get_local $r))))
        ) 
    )
            
    (if (i32.ne (get_local $a) (i32.const 64)) 
        (then
                    (set_local $text (call $string_add (get_local $text) (call $fromCharCode (get_local $i))))
        ) 
    )
            (br $loop_9d020000)
    
        )
    )
    ;; End Loop loop_9d020000
    (set_local $text (call $utf8_decode (get_local $text)))
    (return (get_local $text))
    )
    (func $utf8_encode (param $text i32) (result i32)
        ;; Public Function utf8_encode(text As char*) As char*
        (local $chars i32)
    (local $n i32)
    (local $r i32)
    (set_local $chars (call $new_array ))
    (set_local $text (call $string_replace (get_local $text) (call $regexp (i32.const 88) (i32.const 91)) (i32.const 93)))
    (set_local $n (i32.const 0))
    ;; For n As Integer = 0 To text.Length - 1
    
    (block $block_9e020000 
        (loop $loop_9f020000
    
                    (br_if $block_9e020000 (i32.gt_s (get_local $n) (i32.sub (call $string_length (get_local $text)) (i32.const 1))))
            (set_local $r (call $charCodeAt (get_local $text) (get_local $n)))
            
    (if (i32.lt_s (get_local $r) (i32.const 128)) 
        (then
                    (drop (call $array_push (get_local $chars) (call $fromCharCode (get_local $r))))
        ) (else
                    (drop (call $array_push (get_local $chars) (call $fromCharCode (i32.or (i32.shr_s (get_local $r) (i32.const 12)) (i32.const 224)))))
            (drop (call $array_push (get_local $chars) (call $fromCharCode (i32.or (i32.and (i32.shr_s (get_local $r) (i32.const 6)) (i32.const 63)) (i32.const 128)))))
            (drop (call $array_push (get_local $chars) (call $fromCharCode (i32.or (i32.and (get_local $r) (i32.const 63)) (i32.const 128)))))
        )
    )
            (set_local $n (i32.add (get_local $n) (i32.const 1)))
            (br $loop_9f020000)
            ;; For Loop Next On loop_9f020000
    
        )
    )
    (return (call $Join (get_local $chars) (i32.const 95)))
    )
    (func $utf8_decode (param $text i32) (result i32)
        ;; Public Function utf8_decode(text As char*) As char*
        (local $t i32)
    (local $n i32)
    (local $r i32)
    (local $c2 i32)
    (local $c3 i32)
    (set_local $t (call $new_array ))
    (set_local $n (i32.const 0))
    (set_local $r (i32.const 0))
    (set_local $c2 (i32.const 0))
    (set_local $c3 (i32.const 0))
    ;; Do While (n < text.Length)
    ;; Start Do While Block block_a0020000
    
    (block $block_a0020000 
        (loop $loop_a1020000
    
                    (br_if $block_a0020000 (i32.eqz (i32.lt_s (get_local $n) (call $string_length (get_local $text)))))
            (set_local $r (call $charCodeAt (get_local $text) (get_local $n)))
            
    (if (i32.lt_s (get_local $r) (i32.const 128)) 
        (then
                    (drop (call $array_push (get_local $t) (call $fromCharCode (get_local $r))))
            (set_local $n (i32.add (get_local $n) (i32.const 1)))
        ) (else
                    (set_local $c2 (call $charCodeAt (get_local $text) (i32.add (get_local $n) (i32.const 1))))
            (set_local $c3 (call $charCodeAt (get_local $text) (i32.add (get_local $n) (i32.const 2))))
            (drop (call $array_push (get_local $t) (call $fromCharCode (i32.or (i32.or (i32.shl (i32.and (get_local $r) (i32.const 15)) (i32.const 12)) (i32.shl (i32.and (get_local $c2) (i32.const 63)) (i32.const 6))) (i32.and (get_local $c3) (i32.const 63))))))
            (set_local $n (i32.add (get_local $n) (i32.const 3)))
        )
    )
            (br $loop_a1020000)
    
        )
    )
    ;; End Loop loop_a1020000
    (return (call $Join (get_local $t) (i32.const 96)))
    )
    
    
    ;; functions in [AssemblyInfo]
    
    (func $AssemblyTitle  (result i32)
        ;; Public Function AssemblyTitle() As char*
        
    (return (i32.const 97))
    )
    (func $AssemblyDescription  (result i32)
        ;; Public Function AssemblyDescription() As char*
        
    (return (i32.const 112))
    )
    (func $AssemblyCompany  (result i32)
        ;; Public Function AssemblyCompany() As char*
        
    (return (i32.const 166))
    )
    (func $AssemblyProduct  (result i32)
        ;; Public Function AssemblyProduct() As char*
        
    (return (i32.const 170))
    )
    (func $AssemblyCopyright  (result i32)
        ;; Public Function AssemblyCopyright() As char*
        
    (return (i32.const 177))
    )
    (func $AssemblyTrademark  (result i32)
        ;; Public Function AssemblyTrademark() As char*
        
    (return (i32.const 210))
    )
    (func $Guid  (result i32)
        ;; Public Function Guid() As char*
        
    (return (i32.const 230))
    )
    (func $AssemblyVersion  (result i32)
        ;; Public Function AssemblyVersion() As char*
        
    (return (i32.const 267))
    )
    (func $AssemblyFileVersion  (result i32)
        ;; Public Function AssemblyFileVersion() As char*
        
    (return (i32.const 280))
    )
    )