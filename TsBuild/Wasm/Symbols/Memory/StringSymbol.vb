Namespace Symbols

    Public Class StringSymbol : Inherits Expression

        Public Property [string] As String
        Public Property ptr As MemoryPtr

        Public ReadOnly Property Length As Integer
            Get
                Return Strings.Len([string])
            End Get
        End Property

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "i32"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(data (i32.const {ptr.Ptr}) ""{[string]}"")"
        End Function
    End Class
End Namespace