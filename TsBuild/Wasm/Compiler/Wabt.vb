#Region "Microsoft.VisualBasic::8dc1eed097323e506b40c2b882f6f06f, Compiler\Wabt.vb"

' Author:
' 
'       xieguigang (I@xieguigang.me)
'       asuka (evia@lilithaf.me)
' 
' Copyright (c) 2019 GCModeller Cloud Platform
' 
' 
' MIT License
' 
' 
' Permission is hereby granted, free of charge, to any person obtaining a copy
' of this software and associated documentation files (the "Software"), to deal
' in the Software without restriction, including without limitation the rights
' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
' copies of the Software, and to permit persons to whom the Software is
' furnished to do so, subject to the following conditions:
' 
' The above copyright notice and this permission notice shall be included in all
' copies or substantial portions of the Software.
' 
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
' SOFTWARE.



' /********************************************************************************/

' Summaries:

' Module Wabt
' 
'     Constructor: (+1 Overloads) Sub New
'     Function: Compile, CompileWast, HexDump, saveTemp
' 
' /********************************************************************************/

#End Region

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
        With App.GetAppSysTempFile(".wast", App.PID, "wat2wasm")
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
        With New IORedirectFile(wat2wasm, $"{saveTemp([module]).CLIPath} {config}", debug:=False)
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
        With New IORedirectFile(wat2wasm, $"{saveTemp(wast).CLIPath} {config}", debug:=False)
            Call config.output.ParentPath.MkDIR
            Call .Run()

            Return .StandardOutput
        End With
    End Function

    <Extension>
    Public Function HexDump([module] As ModuleSymbol, Optional verbose As Boolean = False) As String
        Dim config As New wat2wasm With {
            .verbose = verbose,
            .dumpModule = True,
            .debugParser = True
        }

        With New IORedirectFile(wat2wasm, $"{saveTemp([module]).CLIPath} {config}", debug:=False)
            Call .Run()
            Return .StandardOutput
        End With
    End Function
End Module
