Namespace Symbols.Blocks

    Public MustInherit Class Block : Inherits Expression

        Public Property Internal As Expression()

    End Class

    Public Class [Loop] : Inherits Block

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Throw New NotImplementedException()
        End Function

        Public Overrides Function ToSExpression() As String
            Throw New NotImplementedException()
        End Function
    End Class
End Namespace