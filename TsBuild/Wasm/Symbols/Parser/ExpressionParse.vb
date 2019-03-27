Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Namespace Symbols.Parser

    Module ExpressionParse

        <Extension>
        Public Function ValueExpression(value As ExpressionSyntax, symbols As SymbolTable) As Expression
            Select Case value.GetType
                Case GetType(BinaryExpressionSyntax)
                    Return DirectCast(value, BinaryExpressionSyntax).BinaryStack(symbols)
                Case GetType(ParenthesizedExpressionSyntax)
                    Return DirectCast(value, ParenthesizedExpressionSyntax).ParenthesizedStack(symbols)
                Case GetType(LiteralExpressionSyntax)
                    Return DirectCast(value, LiteralExpressionSyntax).ConstantExpression
                Case GetType(IdentifierNameSyntax)
                    Return DirectCast(value, IdentifierNameSyntax).ReferVariable
                Case GetType(InvocationExpressionSyntax)
                    Return DirectCast(value, InvocationExpressionSyntax).FunctionInvoke(symbols)
                Case GetType(UnaryExpressionSyntax)
                    Return DirectCast(value, UnaryExpressionSyntax).UnaryExpression(symbols)
                Case Else
                    Throw New NotImplementedException(value.GetType.FullName)
            End Select
        End Function

        <Extension>
        Public Function UnaryExpression(unary As UnaryExpressionSyntax, symbols As SymbolTable) As FuncInvoke
            Dim op$ = unary.OperatorToken.ValueText
            Dim right = unary.Operand.ValueExpression(symbols)
            Dim left = New LiteralExpression With {
                .type = right.TypeInfer(symbols),
                .value = 0
            }

            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = $"{left.type}.{Types.Operators(op)}",
                .[operator] = True
            }
        End Function

        <Extension>
        Public Iterator Function [Select](args As SeparatedSyntaxList(Of ArgumentSyntax), symbols As SymbolTable) As IEnumerable(Of Expression)
            For i As Integer = 0 To args.Count - 1
                Yield args.Item(i) _
                    .GetExpression _
                    .ValueExpression(symbols)
            Next
        End Function

        <Extension>
        Public Function FunctionInvoke(invoke As InvocationExpressionSyntax, symbols As SymbolTable) As FuncInvoke
            Dim reference = invoke.Expression
            Dim arguments As Expression()
            Dim funcName$

            If invoke.ArgumentList Is Nothing Then
                arguments = {}
            Else
                arguments = invoke.ArgumentList _
                    .Arguments _
                    .Select(symbols) _
                    .ToArray
            End If

            Select Case reference.GetType
                Case GetType(SimpleNameSyntax)
                    funcName = DirectCast(reference, SimpleNameSyntax).Identifier.Text
                Case GetType(IdentifierNameSyntax)
                    funcName = DirectCast(reference, IdentifierNameSyntax).Identifier.Text
                Case Else
                    Throw New NotImplementedException(reference.GetType.FullName)
            End Select

            Return New FuncInvoke With {
                .Reference = funcName,
                .Parameters = arguments
            }
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        <Extension>
        Public Function ReferVariable(name As IdentifierNameSyntax) As Expression
            Return New GetLocalVariable With {
                .var = name.Identifier.ValueText
            }
        End Function

        <Extension>
        Public Function ConstantExpression([const] As LiteralExpressionSyntax) As Expression
            Dim value = [const].Token.Value
            Dim type As Type = value.GetType

            Return New LiteralExpression With {
                .type = Types.Convert2Wasm(type),
                .value = value
            }
        End Function

        <Extension>
        Public Function ParenthesizedStack(parenthesized As ParenthesizedExpressionSyntax, symbols As SymbolTable) As Parenthesized
            Return New Parenthesized With {
                .Internal = parenthesized.Expression.ValueExpression(symbols)
            }
        End Function

        ''' <summary>
        ''' NOTE: div between two integer will convert to double div automatic. 
        ''' </summary>
        ''' <param name="expression"></param>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        <Extension>
        Public Function BinaryStack(expression As BinaryExpressionSyntax, symbols As SymbolTable) As FuncInvoke
            Dim left = expression.Left.ValueExpression(symbols)
            Dim right = expression.Right.ValueExpression(symbols)
            Dim op$ = expression.OperatorToken.ValueText
            Dim type$

            If op = "/" Then
                ' require type conversion if left and right is integer
                ' 对于除法，必须要首先转换为浮点型才能够完成运算
                left = Types.CDbl(left, symbols)
                right = Types.CDbl(right, symbols)
                type = "f64"
            Else
                ' 其他的运算符则需要两边的类型保持一致
                ' 往高位转换
                ' i32 -> f32 -> i64 -> f64
                Dim lt = left.TypeInfer(symbols)
                Dim rt = right.TypeInfer(symbols)
                Dim li = Types.Orders.IndexOf(lt)
                Dim ri = Types.Orders.IndexOf(rt)

                If li > ri Then
                    type = lt
                Else
                    type = rt
                End If

                left = Types.CType(type, left, symbols)
                right = Types.CType(type, right, symbols)
            End If

            Dim funcOpName$ = Types.Operators(op)
            Dim callImports As Boolean = False

            If funcOpName.First = "$"c Then
                ' 当前的VB.NET的运算符是webassembly之中没有原生支持的
                ' 需要从外部导入
                callImports = True
            Else
                funcOpName = $"{type}.{funcOpName}"
            End If

            ' 需要根据类型来决定操作符函数的类型来源
            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = funcOpName,
                .[operator] = Not callImports,
                .callImports = False
            }
        End Function
    End Module
End Namespace