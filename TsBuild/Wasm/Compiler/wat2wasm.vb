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
    <Argv("--debug-parser", CLITypes.Boolean)>
    Public Property debugParser As Boolean

    ''' <summary>
    ''' Print a hexdump of the module to stdout
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--dump-module", CLITypes.Boolean)>
    Public Property dumpModule As Boolean

    ''' <summary>
    ''' Experimental exception handling
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-exceptions", CLITypes.Boolean)>
    Public Property enableExceptions As Boolean

    ''' <summary>
    ''' Import/export mutable globals
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--disable-mutable-globals", CLITypes.Boolean)>
    Public Property disableMutableGlobals As Boolean

    ''' <summary>
    ''' Saturating float-to-int operators
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-saturating-float-to-int", CLITypes.Boolean)>
    Public Property enableSaturatingFloatToInt As Boolean

    ''' <summary>
    ''' Sign-extension operators
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-sign-extension", CLITypes.Boolean)>
    Public Property enableSignExtension As Boolean

    ''' <summary>
    ''' SIMD support
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-simd", CLITypes.Boolean)>
    Public Property enableSimd As Boolean

    ''' <summary>
    ''' Threading support
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--enable-threads", CLITypes.Boolean)>
    Public Property enableThreads As Boolean

    ''' <summary>
    ''' output wasm binary file
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--output", CLITypes.File)>
    Public Property output As String

    ''' <summary>
    ''' Create a relocatable wasm binary (suitable for linking with e.g. lld)
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--relocatable", CLITypes.Boolean)>
    Public Property relocatable As Boolean

    ''' <summary>
    ''' Write all LEB128 sizes as 5-bytes instead of their minimal size
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--no-canonicalize-leb128s", CLITypes.Boolean)>
    Public Property noCanonicalizeLEB128s As Boolean

    ''' <summary>
    ''' Write debug names to the generated binary file
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--debug-names", CLITypes.Boolean)>
    Public Property debugNames As Boolean

    ''' <summary>
    ''' Don't check for invalid modules
    ''' </summary>
    ''' <returns></returns>
    ''' 
    <Argv("--no-check", CLITypes.Boolean)>
    Public Property noCheck As Boolean

    Public Overrides Function ToString() As String
        Return Me.GetCLI
    End Function

    Public Shared Widening Operator CType(output As String) As wat2wasm
        Return New wat2wasm With {.output = output.GetFullPath}
    End Operator

End Class
