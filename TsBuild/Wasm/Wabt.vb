Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices
Imports Microsoft.VisualBasic.Language

''' <summary>
''' WebAssembly ``S-Expression`` compiler
''' </summary>
Public Module Wabt

    ReadOnly wat2wasm$ = App.GetAppSysTempFile(".bin", App.PID) & "/wat2wasm.exe"

    Sub New()
        With App.GetAppSysTempFile(".zip", App.PID)
            Call My.Resources.wabt_1_0_10_win64.FlushStream(.ByRef)
            Call ZipLib.ImprovedExtractToDirectory(.ByRef, wat2wasm.ParentPath, Overwrite.Always)

            If Not wat2wasm.FileExists Then
                Throw New UnauthorizedAccessException($"Access Denied on filesystem location: {wat2wasm.ParentPath}")
            End If
        End With
    End Sub

    ''' <summary>
    ''' Compile VB.NET module parse result to webAssembly binary
    ''' </summary>
    ''' <param name="[module]"></param>
    ''' <returns></returns>
    <Extension>
    Public Function Compile([module] As ModuleSymbol) As String
        With App.GetAppSysTempFile(".wast", App.PID)
            Call [module].ToSExpression.SaveTo(.ByRef)

        End With
    End Function
End Module
