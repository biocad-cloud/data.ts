Imports System.Runtime.CompilerServices
Imports Wasm.Symbols.Parser

Namespace Symbols.Blocks

    ''' <summary>
    ''' 构建生成逻辑表达式的模型
    ''' </summary>
    Public Class BooleanSymbol : Inherits Expression

        Public Property Condition As Expression
        Public Property [IsNot] As Boolean

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="symbolTable"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "i32"
        End Function

        Public Overrides Function ToSExpression() As String
            Dim test$ = Condition.ToSExpression

            If [IsNot] Then
                Return $"(i32.eqz {test})"
            Else
                Return test
            End If
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function BinaryCompares(left As Expression, right As Expression, op$, symbols As SymbolTable) As BooleanSymbol
            Return ExpressionParse.BinaryStack(left, right, op, symbols)
        End Function

        ''' <summary>
        ''' 逻辑值操作主要是数学关系操作符判断
        ''' </summary>
        ''' <param name="op"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Widening Operator CType(op As FuncInvoke) As BooleanSymbol
            Return New BooleanSymbol With {.Condition = op}
        End Operator
    End Class
End Namespace