#Region "Microsoft.VisualBasic::d59f0ee43aa79f0fd22a7365a3671ea5, Symbols\ImportSymbol.vb"

' Author:
' 
'       xieguigang (I@xieguigang.me)
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

'     Class ImportSymbol
' 
'         Properties: ImportObject, MathImports, Package, VBDeclare
' 
'         Constructor: (+2 Overloads) Sub New
'         Function: mathImport, ToSExpression, TypeInfer
' 
' 
' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' Imports object can be parse from the VB.NET ``Declare`` statement
    ''' </summary>
    Public Class ImportSymbol : Inherits FuncSignature

        ''' <summary>
        ''' 外部的模块对象引用名称
        ''' </summary>
        ''' <returns></returns>
        Public Property Package As String
        ''' <summary>
        ''' 这个函数对象在外部模块之中的名称字符串
        ''' </summary>
        ''' <returns></returns>
        Public Property ImportObject As String

        Public ReadOnly Property VBDeclare As String
            Get
                With Parameters _
                    .Select(Function(a) $"{a.Name} As {a.Value}") _
                    .JoinBy(", ")

                    Return $"Declare Function {Name} Lib ""{Package}"" Alias ""{ImportObject}"" ({ .ByRef}) As {Result}"
                End With
            End Get
        End Property

        Public ReadOnly Property Ref As String
            Get
                Return $"{Package}::{ImportObject}"
            End Get
        End Property

        Sub New()
        End Sub

        Sub New(ParamArray args As NamedValue(Of String)())
            Parameters = args
        End Sub

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters _
                .Select(Function(a) a.param) _
                .JoinBy(" ")

            Return $";; {VBDeclare}
    (func ${Name} (import ""{Package}"" ""{ImportObject}"") {params} (result {typefit(Result)}))"
        End Function

        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function

        Public Shared ReadOnly Property MathImports As ImportSymbol()
            <MethodImpl(MethodImplOptions.AggressiveInlining)>
            Get
                Return mathImport().ToArray
            End Get
        End Property

        Public Shared ReadOnly Property JsStringConcatenation As New ImportSymbol With {
            .ImportObject = "add",
            .Name = "string.add",
            .Package = "string",
            .Result = "char*",
            .Parameters = {
                New NamedValue(Of String)("a", "char*"),
                New NamedValue(Of String)("b", "char*")
            }
        }

        Private Shared Iterator Function mathImport() As IEnumerable(Of ImportSymbol)
            Const Math$ = NameOf(Math)

            Yield New ImportSymbol With {
                .Package = Math,
                .ImportObject = "",
                .Name = "",
                .Parameters = {},
                .Result = ""
            }
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Result
        End Function
    End Class
End Namespace
