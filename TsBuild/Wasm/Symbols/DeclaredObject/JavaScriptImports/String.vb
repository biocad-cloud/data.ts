#Region "Microsoft.VisualBasic::0bd7149f52ca70175bd697f7ab8cb0a7, Symbols\DeclaredObject\JavaScriptImports\String.vb"

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

    '     Module [String]
    ' 
    '         Properties: IndexOf, Replace, StringAppend, StringLength
    ' 
    '         Function: GetStringMethod, ToString
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols.JavaScriptImports

    Public Module [String]

        Const stringType$ = "char*"

        Public ReadOnly Property StringAppend As New ImportSymbol With {
            .ImportObject = "add",
            .Name = "string_add",
            .Package = "string",
            .[Module] = "string",
            .Result = "char*",
            .Parameters = {
                New NamedValue(Of String)("a", stringType),
                New NamedValue(Of String)("b", stringType)
            }
        }

        Public ReadOnly Property StringLength As New ImportSymbol With {
            .ImportObject = "length",
            .[Module] = "string",
            .Name = "string_length",
            .Package = "string",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("text", stringType)
            }
        }

        Public ReadOnly Property Replace As New ImportSymbol With {
            .ImportObject = "replace",
            .[Module] = "string",
            .Name = "string_replace",
            .Package = "string",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("input", stringType),
                New NamedValue(Of String)("find", "i32"),
                New NamedValue(Of String)("replacement", stringType)
            }
        }

        Public ReadOnly Property IndexOf As New ImportSymbol With {
            .ImportObject = "indexOf",
            .[Module] = "string",
            .Name = "string_indexOf",
            .Package = "string",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("input", stringType),
                New NamedValue(Of String)("find", stringType)
            }
        }

        Public Function GetStringMethod(name As String) As ImportSymbol
            Select Case name
                Case "Length" : Return StringLength
                Case Else
                    Throw New NotImplementedException
            End Select
        End Function

        ''' <summary>
        ''' 因为WebAssembly没有自动类型转换，所以在这里会需要对每一种数据类型都imports一个相同的函数来完成
        ''' </summary>
        ''' <param name="type"></param>
        ''' <returns></returns>
        Public Function ToString(Optional type As String = "i32") As ImportSymbol
            Return New ImportSymbol With {
                .ImportObject = "toString",
                .Name = $"{type}_toString",
                .[Module] = "string",
                .Package = "string",
                .Result = stringType,
                .Parameters = {
                    New NamedValue(Of String)("s", type)
                }
            }
        End Function
    End Module
End Namespace
