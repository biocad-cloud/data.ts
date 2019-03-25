Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Namespace Symbols

    Public Class FuncSymbol : Inherits Expression

        Public Property Name As String
        Public Property Parameters As NamedValue(Of String)()
        Public Property Result As String
        Public Property Body As Expression()

        Public ReadOnly Property VBDeclare As String
            Get
                Return $"Public Function {Name} ({Parameters.Select(Function(a) $"{a.Name} As {a.Value}").JoinBy(", ")}) As {Result}"
            End Get
        End Property

        Public Overrides Function ToSExpression() As String
            Return $"(func {Name} {Parameters.Select(Function(a) a.param).JoinBy(" ")} (result {Result})
    ;; {VBDeclare}
    {Body.SafeQuery.Select(Function(b) b.ToSExpression).JoinBy(ASCII.LF & "    ")}
)"
        End Function
    End Class
End Namespace