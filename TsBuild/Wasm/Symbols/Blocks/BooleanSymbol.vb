Namespace Symbols.Blocks

    Public Class BooleanSymbol : Inherits Expression

        Public Property Condition As Expression
        Public Property [IsNot] As Boolean

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="symbolTable"></param>
        ''' <returns></returns>
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

        ''' <summary>
        ''' 逻辑值操作主要是数学关系操作符判断
        ''' </summary>
        ''' <param name="op"></param>
        ''' <returns></returns>
        Public Shared Widening Operator CType(op As FuncInvoke) As BooleanSymbol
            Return New BooleanSymbol With {.Condition = op}
        End Operator
    End Class
End Namespace