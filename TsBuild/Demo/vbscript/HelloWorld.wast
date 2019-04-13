(module ;; Module App

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: 1.3.0.22
    ;; build: 4/14/2019 2:36:00 AM

    ;; imports must occur before all non-import definitions

    ;; Declare Function DOMById Lib "document" Alias "getElementById" (id As char*) As i32
(func $DOMById (import "document" "getElementById") (param $id i32) (result i32))
    ;; Declare Function setText Lib "document" Alias "writeElementText" (node As i32, text As char*) As i32
(func $setText (import "document" "writeElementText") (param $node i32) (param $text i32) (result i32))
    ;; Declare Function createElement Lib "document" Alias "createElement" (tagName As char*) As i32
(func $createElement (import "document" "createElement") (param $tagName i32) (result i32))
    ;; Declare Function setAttribute Lib "document" Alias "setAttribute" (node As i32, attr As char*, value As char*) As i32
(func $setAttribute (import "document" "setAttribute") (param $node i32) (param $attr i32) (param $value i32) (result i32))
    ;; Declare Function appendChild Lib "document" Alias "appendChild" (parent As i32, node As i32) As i32
(func $appendChild (import "document" "appendChild") (param $parent i32) (param $node i32) (result i32))
    ;; Declare Function log Lib "console" Alias "log" (message As char*) As i32
(func $log (import "console" "log") (param $message i32) (result i32))
    ;; Declare Function warn Lib "console" Alias "warn" (message As char*) As i32
(func $warn (import "console" "warn") (param $message i32) (result i32))
    ;; Declare Function info Lib "console" Alias "info" (message As char*) As i32
(func $info (import "console" "info") (param $message i32) (result i32))
    ;; Declare Function error Lib "console" Alias "error" (message As char*) As i32
(func $error (import "console" "error") (param $message i32) (result i32))
    
    ;; Only allows one memory block in each module
    (memory (import "env" "bytechunks") 1)

    ;; Memory data for string constant
    
;; String from 1 with 12 bytes in memory
(data (i32.const 1) "Hello World!\00")

;; String from 14 with 54 bytes in memory
(data (i32.const 14) "This message comes from a VisualBasic.NET application!\00")

;; String from 69 with 21 bytes in memory
(data (i32.const 69) "WebAssembly it works!\00")

;; String from 91 with 4 bytes in memory
(data (i32.const 91) "text\00")

;; String from 96 with 5 bytes in memory
(data (i32.const 96) "notes\00")

;; String from 102 with 1 bytes in memory
(data (i32.const 102) "p\00")

;; String from 104 with 1 bytes in memory
(data (i32.const 104) "p\00")

;; String from 106 with 5 bytes in memory
(data (i32.const 106) "style\00")

;; String from 112 with 28 bytes in memory
(data (i32.const 112) "background-color: lightgrey;\00")

;; String from 141 with 5 bytes in memory
(data (i32.const 141) "style\00")

;; String from 147 with 27 bytes in memory
(data (i32.const 147) "font-size: 2em; color: red;\00")

;; String from 175 with 5 bytes in memory
(data (i32.const 175) "style\00")

;; String from 181 with 29 bytes in memory
(data (i32.const 181) "font-size: 5em; color: green;\00")

;; String from 211 with 33 bytes in memory
(data (i32.const 211) "Debug text message display below:\00")

;; String from 245 with 56 bytes in memory
(data (i32.const 245) "Try to display an error message on javascript console...\00")
    
    (global $helloWorld (mut i32) (i32.const 1))

(global $note (mut i32) (i32.const 14))

(global $note2 (mut i32) (i32.const 69))

    (export "RunApp" (func $RunApp)) 

    (func $RunApp  (result i32)
        ;; Public Function RunApp() As i32
        (local $textNode i32)
    (local $notes i32)
    (local $message1 i32)
    (local $message2 i32)
    (set_local $textNode (call $DOMById (i32.const 91)))
    (set_local $notes (call $DOMById (i32.const 96)))
    (set_local $message1 (call $createElement (i32.const 102)))
    (set_local $message2 (call $createElement (i32.const 104)))
    (call $setText (get_local $textNode) (get_global $helloWorld))
    (call $setText (get_local $message1) (get_global $note))
    (call $setText (get_local $message2) (get_global $note2))
    (call $appendChild (get_local $notes) (get_local $message1))
    (call $appendChild (get_local $notes) (get_local $message2))
    (call $setAttribute (get_local $notes) (i32.const 106) (i32.const 112))
    (call $setAttribute (get_local $message1) (i32.const 141) (i32.const 147))
    (call $setAttribute (get_local $message2) (i32.const 175) (i32.const 181))
    (call $log (i32.const 211))
    (call $warn (get_global $note))
    (call $info (get_global $note2))
    (call $error (i32.const 245))
    (return (i32.const 0))
    ))