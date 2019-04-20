#Region "Microsoft.VisualBasic::12133842922ad58c59528582e4b134ac, Symbols\DeclaredObject\ImportSymbol.vb"

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

    '     Class ImportSymbol
    ' 
    '         Properties: ImportObject, Package, VBDeclare
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: ToSExpression, ToString, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' Imports object can be parse from the VB.NET ``Declare`` statement
    ''' </summary>
    Public Class ImportSymbol : Inherits FuncSignature
        Implements IDeclaredObject

        ''' <summary>
        ''' 外部的模块对象引用名称
        ''' 
        ''' 请注意，这个是外部模块的名称，对于在VB之中申明的这个API，
        ''' 其还存在一个<see cref="[Module]"/>标记其在VB工程项目之中的模块名称
        ''' </summary>
        ''' <returns></returns>
        Public Property Package As String Implements IDeclaredObject.Module
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

        Sub New()
        End Sub

        Sub New(ParamArray args As NamedValue(Of String)())
            Parameters = args
        End Sub

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters _
                .Select(Function(a) a.param) _
                .JoinBy(" ")
            Dim returnType$ = typefit(Result)

            If returnType = "void" Then
                returnType = ""
            Else
                returnType = $"(result {typefit(Result)})"
            End If

            Return $";; {VBDeclare}
    (func ${Name} (import ""{Package}"" ""{ImportObject}"") {params} {returnType})"
        End Function

        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Result
        End Function
    End Class
End Namespace
