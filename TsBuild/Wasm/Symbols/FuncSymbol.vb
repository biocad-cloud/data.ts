Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
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

        ''' <summary>
        ''' 因为webassembly只允许变量必须要定义在最开始的位置
        ''' 所以构建函数体的时候流程会有些复杂
        ''' </summary>
        ''' <returns></returns>
        Private Function buildBody() As String
            ' 先声明变量，然后再逐步赋值
            Dim declareLocals As New List(Of String)
            Dim body As New List(Of String)

            For Each line In Me.Body
                If TypeOf line Is DeclareLocal Then
                    declareLocals += line.ToSExpression

                    With DirectCast(line, DeclareLocal)
                        If Not .init Is Nothing Then
                            body += .SetLocal.ToSExpression
                        End If
                    End With
                Else
                    body += line.ToSExpression
                End If
            Next

            Return declareLocals.JoinBy(ASCII.LF) & body.JoinBy(ASCII.LF)
        End Function

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")

            Return $"(func ${Name} {params} (result {Result})
    ;; {VBDeclare}
    {buildBody()}
)"
        End Function
    End Class
End Namespace