Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Module ExpressionParse

    <Extension>
    Public Function ValueExpression(value As ExpressionSyntax) As Expression
        Select Case value.GetType
            Case GetType(BinaryExpressionSyntax)
                Return DirectCast(value, BinaryExpressionSyntax).BinaryStack
            Case GetType(ParenthesizedExpressionSyntax)
                Return DirectCast(value, ParenthesizedExpressionSyntax).ParenthesizedStack
            Case GetType(LiteralExpressionSyntax)
                Return DirectCast(value, LiteralExpressionSyntax).ConstantExpression
            Case GetType(IdentifierNameSyntax)
                Return DirectCast(value, IdentifierNameSyntax).ReferVariable
            Case Else
                Throw New NotImplementedException(value.GetType.FullName)
        End Select
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
            .type = type,
            .value = value
        }
    End Function

    <Extension>
    Public Function ParenthesizedStack(parenthesized As ParenthesizedExpressionSyntax) As Parenthesized
        Return New Parenthesized With {.Internal = parenthesized.Expression.ValueExpression}
    End Function

    <Extension>
    Public Function BinaryStack(expression As BinaryExpressionSyntax) As FuncInvoke
        Dim left = expression.Left.ValueExpression
        Dim right = expression.Right.ValueExpression
        Dim op$ = expression.OperatorToken.ValueText

        ' 需要根据类型来决定操作符函数的类型来源
        Return New FuncInvoke With {
            .Parameters = {left, right},
            .Reference = $"{Types.Convert2Wasm(GetType(Double))}.{Types.Operators(op)}"
        }
    End Function
End Module
