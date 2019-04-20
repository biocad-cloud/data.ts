#Region "Microsoft.VisualBasic::41f753389784a375de6b147001af1fd8, Symbols\DeclaredObject\JavaScriptImports.vb"

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

    '     Class NamespaceDoc
    ' 
    '         Constructor: (+1 Overloads) Sub New
    ' 
    '     Module Math
    ' 
    ' 
    ' 
    '     Module [String]
    ' 
    '         Properties: Concatenation
    ' 
    '         Function: ToString
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols.JavaScriptImports

    ''' <summary>
    ''' Some auto imports javascript API that required for implements VB programming.
    ''' </summary>
    Friend NotInheritable Class NamespaceDoc
        Private Sub New()
        End Sub
    End Class

    Public Module Math

    End Module

    Public Module Array

        ''' <summary>
        ''' Push element value into a given array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property PushArray As New ImportSymbol With {
            .ImportObject = "push",
            .Name = "push.array",
            .[Module] = "array",
            .Package = "array",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("element", "i32")
            }
        }

        ''' <summary>
        ''' Create an new array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property NewArray As New ImportSymbol With {
            .ImportObject = "new",
            .[Module] = "array",
            .Name = "new.array",
            .Package = "array",
            .Result = "i32",
            .Parameters = {}
        }

    End Module

    Public Module [String]

        Public ReadOnly Property Concatenation As New ImportSymbol With {
            .ImportObject = "add",
            .Name = "string.add",
            .Package = "string",
            .Result = "char*",
            .Parameters = {
                New NamedValue(Of String)("a", "char*"),
                New NamedValue(Of String)("b", "char*")
            }
        }

        ''' <summary>
        ''' 因为WebAssembly没有自动类型转换，所以在这里会需要对每一种数据类型都imports一个相同的函数来完成
        ''' </summary>
        ''' <param name="type"></param>
        ''' <returns></returns>
        Public Function ToString(Optional type As String = "i32") As ImportSymbol
            Return New ImportSymbol With {
                .ImportObject = "toString",
                .Name = $"{type}.toString",
                .Package = "string",
                .Result = "char*",
                .Parameters = {
                    New NamedValue(Of String)("s", type)
                }
            }
        End Function
    End Module
End Namespace
