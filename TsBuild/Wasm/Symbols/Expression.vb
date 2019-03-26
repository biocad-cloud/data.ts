Namespace Symbols

    Public MustInherit Class Expression

        Public MustOverride Function TypeInfer(symbolTable As SymbolTable) As String
        Public MustOverride Function ToSExpression() As String

        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function

    End Class
End Namespace