Namespace Symbols
    Public Class ImportSymbol : Inherits FuncSignature

        Public Property Package As String
        Public Property ImportObject As String

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")

            Return $"(func ${Name} (import ""{Package}"" ""{ImportObject}"") {params} (result {Result}))"
        End Function
    End Class
End Namespace


