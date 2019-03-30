Namespace Symbols.Blocks

    Public Class IfBlock : Inherits AbstractBlock

        Public Property Condition As BooleanSymbol
        Public Property [Then] As Expression()
        Public Property [Else] As Expression()

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"
(if {Condition} 
    (then
        {Block.InternalBlock([Then], "        ")}
    )
    (else
        {Block.InternalBlock([Else], "        ")}
    )
)"
        End Function
    End Class
End Namespace