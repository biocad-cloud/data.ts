#Region "Microsoft.VisualBasic::34d081211779cd4aab9b538ae9330377, Symbols\Memory\ArraySymbol.vb"

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

    '     Class ArraySymbol
    ' 
    '         Properties: Initialize, Type
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Namespace Symbols

    ''' <summary>
    ''' Expression for create an new array
    ''' </summary>
    Public Class ArraySymbol : Inherits Expression

        ''' <summary>
        ''' Element type name
        ''' </summary>
        ''' <returns></returns>
        Public Property Type As String
        Public Property Initialize As Expression()

        Public Overrides Function ToSExpression() As String
            ' create array object in javascript runtime
            Dim newArray As New FuncInvoke(JavaScriptImports.Array.NewArray.Name) With {.Parameters = {}}

            If Initialize.IsNullOrEmpty Then
                ' 空数组
                Return newArray.ToSExpression
            End If

            Dim arrayPush$ = JavaScriptImports.PushArray.Name
            Dim array As Expression = New FuncInvoke(arrayPush) With {
                .Parameters = {newArray, Initialize(Scan0)}
            }

            ' and then push elements into that new array
            For Each value As Expression In Initialize.Skip(1)
                array = New FuncInvoke(arrayPush) With {
                    .Parameters = {array, value}
                }
            Next

            ' at last return new array intptr
            Return array.ToSExpression
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Type
        End Function
    End Class
End Namespace
