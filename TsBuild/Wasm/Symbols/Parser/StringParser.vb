#Region "Microsoft.VisualBasic::fb8321650f3521ba7fab2ebb36d4d276, Symbols\Parser\StringParser.vb"

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

    '     Module StringParser
    ' 
    '         Function: AnyToString, getContent, StringAppend, StringExpression
    ' 
    '         Sub: addRequired, stringValue
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Namespace Symbols.Parser

    Module StringParser

        ''' <summary>
        ''' VB string concatenation
        ''' </summary>
        ''' <param name="symbols"></param>
        ''' <param name="left"></param>
        ''' <param name="right"></param>
        ''' <returns></returns>
        <Extension>
        Public Function StringAppend(symbols As SymbolTable, left As Expression, right As Expression) As Expression
            Dim append = JavaScriptImports.String.StringAppend

            ' try add required imports symbol
            Call symbols.addRequired(append)

            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = append.Name,
                .[operator] = False
            }
        End Function

        ''' <summary>
        ''' 尝试添加编程所需的一些基本的API，例如字符串操作，数组操作等
        ''' </summary>
        ''' <param name="symbols"></param>
        ''' <param name="symbol"></param>
        <Extension>
        Public Sub addRequired(symbols As SymbolTable, symbol As ImportSymbol)
            Dim ref$ = symbol.Name

            If Not ref Like symbols.Requires Then
                symbols.Requires.Add(ref)
                symbols.AddImports(symbol)
            End If
        End Sub

        <Extension>
        Friend Sub stringValue(symbols As SymbolTable, ByRef value As Object, ByRef type$)
            ' 是字符串类型，需要做额外的处理
            value = symbols.memory.AddString(value)
            type = "char*"

            Call symbols.addRequired(JavaScriptImports.String.Replace)
            Call symbols.addRequired(JavaScriptImports.String.StringAppend)
            Call symbols.addRequired(JavaScriptImports.String.StringLength)
            Call symbols.addRequired(JavaScriptImports.String.IndexOf)
        End Sub

        <Extension>
        Public Function StringExpression(str As InterpolatedStringExpressionSyntax, symbols As SymbolTable) As Expression
            Dim expression As Expression = str.Contents.First.getContent(symbols)

            For Each part As InterpolatedStringContentSyntax In str.Contents.Skip(1)
                expression = symbols.StringAppend(expression, part.getContent(symbols))
            Next

            Return expression
        End Function

        <Extension>
        Private Function getContent(str As InterpolatedStringContentSyntax, symbols As SymbolTable) As Expression
            If TypeOf str Is InterpolatedStringTextSyntax Then
                Dim value As Object
                Dim type$ = Nothing

                value = DirectCast(str, InterpolatedStringTextSyntax).TextToken.ValueText
                symbols.stringValue(value, type)

                Return New LiteralExpression With {
                    .type = Type,
                    .value = value
                }
            Else
                Return DirectCast(str, InterpolationSyntax) _
                    .Expression _
                    .ValueExpression(symbols) _
                    .AnyToString(symbols)
            End If
        End Function

        <Extension>
        Public Function AnyToString(value As Expression, symbols As SymbolTable) As Expression
            Dim toString = JavaScriptImports.String.ToString(value.TypeInfer(symbols))

            symbols.addRequired(toString)
            value = New FuncInvoke With {
                .[operator] = False,
                .Reference = toString.Name,
                .Parameters = {value}
            }

            Return value
        End Function
    End Module
End Namespace
