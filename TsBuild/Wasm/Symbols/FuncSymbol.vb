Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Namespace Symbols

    Public MustInherit Class FuncSignature : Inherits Expression

        Public Property Name As String
        Public Property Parameters As NamedValue(Of String)()
        Public Property Result As String

    End Class

    Public Class FuncSymbol : Inherits FuncSignature

        Public Property Body As Expression()

        Public ReadOnly Property VBDeclare As String
            Get
                Return $"Public Function {Name} ({Parameters.Select(Function(a) $"{a.Name} As {a.Value}").JoinBy(", ")}) As {Result}"
            End Get
        End Property

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")
            Dim body$ = Me.Body _
                .SafeQuery _
                .Select(Function(b) b.ToSExpression) _
                .JoinBy(ASCII.LF & "    ")

            Return $"(func {Name} {params} (result {Result})
    ;; {VBDeclare}
    {body}
)"
        End Function
    End Class
End Namespace