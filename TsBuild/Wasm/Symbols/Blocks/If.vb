Namespace Symbols.Blocks

    Public Class IfBlock : Inherits Block

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $""
        End Function
    End Class
End Namespace