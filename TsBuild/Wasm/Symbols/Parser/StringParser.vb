Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Namespace Symbols.Parser

    Module StringParser

        <Extension>
        Public Function StringAppend(symbols As SymbolTable, left As Expression, right As Expression) As Expression
            ' vb string concatenation
            If Not ImportSymbol.JsStringConcatenation.Ref Like symbols.Requires Then
                symbols.Requires.Add(ImportSymbol.JsStringConcatenation.Ref)
                symbols.AddImports(ImportSymbol.JsStringConcatenation)
            End If

            Return stringConcatenation(left, right)
        End Function

        Private Function stringConcatenation(left As Expression, right As Expression) As Expression
            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = ImportSymbol.JsStringConcatenation.Name,
                .[operator] = False
            }
        End Function

        <Extension>
        Friend Sub stringValue(memory As Memory, ByRef value As Object, ByRef type$)
            ' 是字符串类型，需要做额外的处理
            value = memory.AddString(value)
            type = "char*"
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
                symbols.memory.stringValue(value, Type)

                Return New LiteralExpression With {
                    .type = Type,
                    .value = value
                }
            Else
                Dim value = DirectCast(str, InterpolationSyntax) _
                    .Expression _
                    .ValueExpression(symbols)
                Dim toString$ = ImportSymbol.JsObjectToString(value.TypeInfer(symbols)).Name

                value = New FuncInvoke With {
                    .[operator] = False,
                    .Reference = toString,
                    .Parameters = {value}
                }

                Return value
            End If
        End Function
    End Module
End Namespace