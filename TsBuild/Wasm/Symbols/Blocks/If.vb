Namespace Symbols.Blocks

    Public Class IfBlock : Inherits Block

        Public Property Condition As Expression
        Public Property [Then] As Expression()
        Public Property [Else] As Expression()

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"
(if {Condition} 
    (then
        {InternalBlock([Then], "        ")}
    )
    (else
        {InternalBlock([Else], "        ")}
    )
)"
        End Function
    End Class
End Namespace