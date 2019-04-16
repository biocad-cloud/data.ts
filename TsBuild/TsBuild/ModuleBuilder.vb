Imports Microsoft.VisualBasic.Emit.Marshal
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

''' <summary>
''' The typescript module definition file to VB.NET module convertor
''' </summary>
Public Class ModuleBuilder

    Dim escape As New Escapes
    Dim buffer As New List(Of Char)

    Public Iterator Function ParseIndex(text As String) As IEnumerable(Of Token)
        Dim code As New Pointer(Of Char)(text.SolveStream)
        Dim c As Value(Of Char) = ""
        Dim type As Value(Of TypeScriptTokens) = TypeScriptTokens.undefined

        Do While (c = ++code) <> ASCII.NUL
            If (type = walkChar(c)) <> TypeScriptTokens.undefined AndAlso buffer > 0 Then
                Yield New Token With {
                    .Text = buffer.CharString,
                    .Type = type
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
            If c = ASCII.CR OrElse c = ASCII.LF Then
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
        End If

        If c = "/"c Then
            buffer += "/"c

            If bufferEquals("//") Then
                escape.SingleLineComment = True
            Else
                Throw New SyntaxErrorException
            End If
        ElseIf c = " "c Then
            ' a string delimiter
            If bufferEndWith(":") Then
                Return TypeScriptTokens.parameterName
            ElseIf bufferEndWith("(") Then
                Return TypeScriptTokens.functionName
            End If
        End If

        Return TypeScriptTokens.undefined
    End Function
End Class

Public Enum TypeScriptTokens
    undefined = 0
    [declare]
    keyword
    [function]
    functionName
    parameterName
    typeName
    comment
    constructor
End Enum

Public Class Token

    Public Property Text As String
    Public Property Type As TypeScriptTokens

End Class

Public Class Escapes

    Public Property SingleLineComment As Boolean
    Public Property BlockTextComment As Boolean

End Class