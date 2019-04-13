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

Namespace Symbols

    ''' <summary>
    ''' Imports object can be parse from the VB.NET ``Declare`` statement
    ''' </summary>
    Public Class ImportSymbol : Inherits FuncSignature

        Public Property Package As String
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

            Return $";; {VBDeclare}
(func ${Name} (import ""{Package}"" ""{ImportObject}"") {params} (result {Result}))"
        End Function

        Public Shared ReadOnly Property MathImports As ImportSymbol()
            <MethodImpl(MethodImplOptions.AggressiveInlining)>
            Get
                Return mathImport().ToArray
            End Get
        End Property

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
