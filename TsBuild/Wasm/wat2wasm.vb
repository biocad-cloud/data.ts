Imports Microsoft.VisualBasic.CommandLine.InteropService
Imports Microsoft.VisualBasic.CommandLine.Reflection

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
    ''' 
    <Argv("--verbose", CLITypes.Boolean)>
    Public Property verbose As Boolean

    ''' <summary>
    ''' Turn on debugging the parser of wat files
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--debug-parser")>
    Public Property debugParser As Boolean

    ''' <summary>
    ''' Print a hexdump of the module to stdout
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--dump-module")>
    Public Property dumpModule As Boolean

    ''' <summary>
    ''' Experimental exception handling
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-exceptions")>
    Public Property enableExceptions As Boolean

    ''' <summary>
    ''' Import/export mutable globals
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--disable-mutable-globals")>
    Public Property disableMutableGlobals As Boolean

    ''' <summary>
    ''' Saturating float-to-int operators
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-saturating-float-to-int")>
    Public Property enableSaturatingFloatToInt As Boolean

    ''' <summary>
    ''' Sign-extension operators
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-sign-extension")>
    Public Property enableSignExtension As Boolean

    ''' <summary>
    ''' SIMD support
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-simd")>
    Public Property enableSimd As Boolean

    ''' <summary>
    ''' Threading support
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-threads")>
    Public Property enableThreads As Boolean

    ''' <summary>
    ''' output wasm binary file
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--output", CLITypes.File, Format:="--output=%s")>
    Public Property output As String

    ''' <summary>
    ''' Create a relocatable wasm binary (suitable for linking with e.g. lld)
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--relocatable")>
    Public Property relocatable As Boolean

    ''' <summary>
    ''' Write all LEB128 sizes as 5-bytes instead of their minimal size
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--no-canonicalize-leb128s")>
    Public Property noCanonicalizeLEB128s As Boolean

    ''' <summary>
    ''' Write debug names to the generated binary file
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--debug-names")>
    Public Property debugNames As Boolean

    ''' <summary>
    ''' Don't check for invalid modules
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--no-check")>
    Public Property noCheck As Boolean

    Public Overrides Function ToString() As String
        Return Me.GetCLI
    End Function

End Class
