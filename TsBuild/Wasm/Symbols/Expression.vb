Namespace Symbols

    Public MustInherit Class Expression

        Public MustOverride Function ToSExpression() As String

        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function

    End Class
End Namespace