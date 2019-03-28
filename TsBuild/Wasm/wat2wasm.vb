''' <summary>
''' Translate from WebAssembly text format to the WebAssembly binary format
''' </summary>
''' <remarks>
''' https://webassembly.github.io/wabt/doc/wat2wasm.1.html
''' </remarks>
Public Class wat2wasm

    ''' <summary>
    ''' Use multiple times for more info
    ''' </summary>
    ''' <returns></returns>
    Public Property verbose As Boolean
    ''' <summary>
    ''' Turn on debugging the parser of wat files
    ''' </summary>
    ''' <returns></returns>
    Public Property debugParser As Boolean
    ''' <summary>
    ''' Print a hexdump of the module to stdout
    ''' </summary>
    ''' <returns></returns>
    Public Property dumpModule As Boolean
    ''' <summary>
    ''' Experimental exception handling
    ''' </summary>
    ''' <returns></returns>
    Public Property enableExceptions As Boolean
    ''' <summary>
    ''' Import/export mutable globals
    ''' </summary>
    ''' <returns></returns>
    Public Property disableMutableGlobals As Boolean
    ''' <summary>
    ''' Saturating float-to-int operators
    ''' </summary>
    ''' <returns></returns>
    Public Property enableSaturatingFloatToInt As Boolean
    ''' <summary>
    ''' Sign-extension operators
    ''' </summary>
    ''' <returns></returns>
    Public Property enableSignExtension As Boolean
    ''' <summary>
    ''' SIMD support
    ''' </summary>
    ''' <returns></returns>
    Public Property enableSimd As Boolean
    ''' <summary>
    ''' Threading support
    ''' </summary>
    ''' <returns></returns>
    Public Property enableThreads As Boolean
    ''' <summary>
    ''' output wasm binary file
    ''' </summary>
    ''' <returns></returns>
    Public Property output As String
    ''' <summary>
    ''' Create a relocatable wasm binary (suitable for linking with e.g. lld)
    ''' </summary>
    ''' <returns></returns>
    Public Property relocatable As Boolean
    ''' <summary>
    ''' Write all LEB128 sizes as 5-bytes instead of their minimal size
    ''' </summary>
    ''' <returns></returns>
    Public Property noCanonicalizeLEB128s As Boolean
    ''' <summary>
    ''' Write debug names to the generated binary file
    ''' </summary>
    ''' <returns></returns>
    Public Property debugNames As Boolean
    ''' <summary>
    ''' Don't check for invalid modules
    ''' </summary>
    ''' <returns></returns>
    Public Property noCheck As Boolean

End Class
