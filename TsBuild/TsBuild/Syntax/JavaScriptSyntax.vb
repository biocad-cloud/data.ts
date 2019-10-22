Imports Microsoft.VisualBasic.Emit.Marshal
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

''' <summary>
''' The javascript syntax parser
''' </summary>
Public Class JavaScriptSyntax

    Dim escape As New JavaScriptEscapes
    Dim buffer As New List(Of Char)

    Private Function getTextCode(text As String) As Pointer(Of Char)
        text = text.SolveStream
        text = text.LineTokens.JoinBy(ASCII.LF)

        Return New Pointer(Of Char)(text)
    End Function

    Public Iterator Function ParseTokens(text As String) As IEnumerable(Of Token)
        Dim code As Pointer(Of Char) = getTextCode(text)
        Dim c As Value(Of Char) = ""
        Dim type As Value(Of TypeScriptTokens) = TypeScriptTokens.undefined

        Do While (c = ++code) <> ASCII.NUL
            If (type = walkChar(c)) <> TypeScriptTokens.undefined AndAlso buffer > 0 Then
                Yield New Token With {
                    .text = buffer.CharString,
                    .type = type
                }

                ' clear buffer
                buffer *= 0
            End If
        Loop
    End Function

    Private Function bufferEquals(test As String) As Boolean
        Return buffer.SequenceEqual(test)
    End Function

    Private Function bufferStartWith(test As String) As Boolean
        Return buffer.Take(test.Length).SequenceEqual(test)
    End Function

    Private Function bufferEndWith(test As String) As Boolean
        Return buffer.Skip(buffer.Count - test.Length).SequenceEqual(test)
    End Function

    Private Function walkChar(c As Char) As TypeScriptTokens
        If escape.SingleLineComment Then
            If c = ASCII.LF Then
                ' 单行注释在遇到换行符之后结束
                escape.SingleLineComment = False
                Return TypeScriptTokens.comment
            Else
                buffer += c
            End If
        ElseIf escape.BlockTextComment Then
            buffer += c

            If bufferEndWith("*/") Then
                escape.BlockTextComment = False
                Return TypeScriptTokens.comment
            End If
        ElseIf escape.StringContent Then
            buffer += c

            If c = escape.StringStackSymbol AndAlso buffer(-2) <> "\"c Then
                ' 结束字符串
                escape.StringContent = False
                Return TypeScriptTokens.string
            End If
        Else
            If c = " "c OrElse c = ASCII.LF Then
                ' a string delimiter
                If bufferEndWith(":") Then
                    Return TypeScriptTokens.identifier
                ElseIf bufferEndWith("(") Then
                    Return TypeScriptTokens.functionName
                ElseIf buffer.CharString Like Symbols.Keywords Then
                    Return TypeScriptTokens.keyword
                ElseIf bufferEquals("{") Then
                    Return TypeScriptTokens.openStack
                ElseIf bufferEquals("}") Then
                    Return TypeScriptTokens.closeStack
                Else
                    Dim tokenText$ = buffer.CharString

                    Select Case tokenText
                        Case "this"
                            Return TypeScriptTokens.keyword
                        Case "var", "let"
                            Return TypeScriptTokens.declare
                        Case "=", ">", "<", "+", "-", "*", "/", "&&", "||", "|", "&", "%", "=>", "<="
                            Return TypeScriptTokens.operator
                        Case Else
                            Return TypeScriptTokens.identifier
                    End Select
                End If
            ElseIf c = "("c Then
                Return TypeScriptTokens.functionName
            ElseIf c = ")"c OrElse c = ","c Then
                Return TypeScriptTokens.typeName
            ElseIf c = ";"c Then
                Return TypeScriptTokens.funcType
            ElseIf c = ":"c Then
                Return TypeScriptTokens.identifier
            ElseIf c = """" OrElse c = "'" OrElse c = "`" Then
                If Not escape.StringContent Then
                    escape.StringContent = True
                    escape.StringStackSymbol = c
                    buffer += c
                Else
                    buffer += c
                End If
            Else
                buffer += c

                If bufferStartWith("//") Then
                    escape.SingleLineComment = True
                ElseIf bufferStartWith("/*") Then
                    escape.BlockTextComment = True
                Else

                End If
            End If
        End If

        Return TypeScriptTokens.undefined
    End Function
End Class