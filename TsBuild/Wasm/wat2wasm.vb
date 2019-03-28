''' <summary>
''' Translate from WebAssembly text format to the WebAssembly binary format
''' </summary>
''' <remarks>
''' https://webassembly.github.io/wabt/doc/wat2wasm.1.html
''' </remarks>
Public Class wat2wasm

    Public Property verbose As Boolean
    Public Property debugParser As Boolean
    Public Property dumpModule As Boolean
    Public Property enableExceptions As Boolean
    Public Property disableMutableGlobals As Boolean
    Public Property enableSaturatingFloatToInt As Boolean
    Public Property enableSignExtension As Boolean
    Public Property enableSimd As Boolean
    Public Property enableThreads As Boolean
    Public Property output As String
    Public Property relocatable As Boolean
    Public Property noCanonicalizeLEB128s As Boolean
    Public Property debugNames As Boolean
    Public Property noCheck As Boolean

End Class
