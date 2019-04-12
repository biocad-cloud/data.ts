Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices
Imports Microsoft.VisualBasic.CommandLine
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols

''' <summary>
''' WebAssembly ``S-Expression`` compiler
''' </summary>
Public Module Wabt

    ReadOnly wat2wasm$ = App.ProductSharedDIR & "/wabt_bin/wat2wasm.exe"

    Sub New()
        If wat2wasm.FileExists Then
            Return
        End If

        ' Release compiler if not exists.
        With App.GetAppSysTempFile(".zip")
            Call My.Resources.wabt_1_0_10_win64.FlushStream(.ByRef)
            Call ZipLib.ImprovedExtractToDirectory(.ByRef, wat2wasm.ParentPath, Overwrite.Always)

            If Not wat2wasm.FileExists Then
                Throw New UnauthorizedAccessException($"Access Denied on filesystem location: {wat2wasm.ParentPath}")
            End If
        End With
    End Sub

    ''' <summary>
    ''' 
    ''' </summary>
    ''' <param name="[module]">The module symbol object or wast source file text content.</param>
    ''' <returns></returns>
    <Extension>
    Private Function saveTemp([module] As [Variant](Of ModuleSymbol, String)) As String
        With App.GetAppSysTempFile(".wast", App.PID)
            If [module] Like GetType(ModuleSymbol) Then
                Call CType([module], ModuleSymbol) _
                    .ToSExpression _
                    .SaveTo(.ByRef)
            Else
                Call CType([module], String) _
                    .SolveStream _
                    .SaveTo(.ByRef)
            End If

            Return .ByRef
        End With
    End Function

    ''' <summary>
    ''' Compile VB.NET module parse result to webAssembly binary
    ''' </summary>
    ''' <param name="[module]"></param>
    ''' <returns>
    ''' This function returns the compiler standard output
    ''' </returns>
    <Extension>
    Public Function Compile([module] As ModuleSymbol, config As wat2wasm) As String
        With New IORedirectFile(wat2wasm, $"{saveTemp([module]).CLIPath} {config}")
            Call .Run()
            Return .StandardOutput
        End With
    End Function

    ''' <summary>
    ''' Compile wast file to wasm binary and then returns the compiler log.
    ''' </summary>
    ''' <param name="wast">The file text</param>
    ''' <returns></returns>
    Public Function CompileWast(wast As String, config As wat2wasm) As String
        With New IORedirectFile(wat2wasm, $"{saveTemp(wast).CLIPath} {config}")
            Call config.output.ParentPath.MkDIR
            Call .Run()

            Return .StandardOutput
        End With
    End Function

    <Extension>
    Public Function HexDump([module] As ModuleSymbol, Optional verbose As Boolean = False) As String
        Dim config As New wat2wasm With {.verbose = verbose, .dumpModule = True}

        With New IORedirectFile(wat2wasm, $"{saveTemp([module]).CLIPath} {config}")
            Call .Run()
            Return .StandardOutput
        End With
    End Function
End Module
